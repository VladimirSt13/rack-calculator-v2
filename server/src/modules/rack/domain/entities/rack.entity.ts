import type { RackResult, RackInput } from '../calculateRack'
import { calculateRack } from '../calculateRack'

/**
 * Rack Entity
 * Представляет рассчитанный стеллаж в системе
 */
export interface RackConfiguration {
  levels: number
  rows: number
  beamsPerRow: number
  supportType: string
  verticalStandType?: string
  spans: { type: string; quantity: number }[]
}

export interface RackPricing {
  base: number
  withoutIsolators: number
  zero: number
}

export class RackEntity {
  public readonly id?: string
  public readonly name: string
  public readonly description: string
  public readonly configuration: RackConfiguration
  public readonly components: RackResult['components']
  public readonly totalLength: number
  public pricing?: RackPricing
  public readonly createdAt?: Date
  public readonly updatedAt?: Date

  constructor(data: Partial<RackEntity>) {
    this.id = data.id
    this.name = data.name!
    this.description = data.description!
    this.configuration = data.configuration!
    this.components = data.components!
    this.totalLength = data.totalLength!
    this.pricing = data.pricing
    this.createdAt = data.createdAt
    this.updatedAt = data.updatedAt
  }

  /**
   * Создание нового RackEntity из входных параметров
   */
  static create(input: RackInput): RackEntity {
    const result = calculateRack(input)

    return new RackEntity({
      name: result.name,
      description: result.description,
      configuration: {
        levels: input.levels,
        rows: input.rows,
        beamsPerRow: input.beamsPerRow,
        supportType: input.supportType,
        verticalStandType: input.verticalStandType,
        spans: input.spans,
      },
      components: result.components,
      totalLength: result.totalLength,
    })
  }

  /**
   * Создание RackEntity из сохранённых данных
   */
  static fromPersistence(data: {
    id?: string
    name: string
    description: string
    configuration: RackConfiguration
    components: RackResult['components']
    totalLength: number
    pricing?: RackPricing
    createdAt?: Date
    updatedAt?: Date
  }): RackEntity {
    return new RackEntity({
      id: data.id,
      name: data.name,
      description: data.description,
      configuration: data.configuration,
      components: data.components,
      totalLength: data.totalLength,
      pricing: data.pricing,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    })
  }

  /**
   * Обновление pricing информации
   */
  setPricing(pricing: RackPricing): void {
    this.pricing = pricing
  }

  /**
   * Конвертация в объект для персистентности
   */
  toPersistence(): object {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      configuration: this.configuration,
      components: this.components,
      totalLength: this.totalLength,
      pricing: this.pricing,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    }
  }
}
