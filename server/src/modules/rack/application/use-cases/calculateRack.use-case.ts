import { z } from 'zod'
import { RackRepository } from '../../infrastructure/rack.repository'
import { PriceService } from '../../../price/infrastructure/price.service'
import { calculateRack } from '../../domain/calculateRack'
import type { RackPricing } from '../../domain/entities/rack.entity'
import type { RackResult } from '../../domain/calculateRack'

/**
 * Входная схема для валидации
 */
const calculateRackSchema = z.object({
  levels: z.number().int().min(1).max(10),
  rows: z.number().int().min(1).max(4),
  beamsPerRow: z.number().int().min(2).max(4),
  supportType: z.string().nonempty(),
  verticalStandType: z.string().optional(),
  spans: z.array(
    z.object({
      type: z.string().nonempty(),
      quantity: z.number().int().min(1),
    })
  ),
})

export type CalculateRackInput = z.infer<typeof calculateRackSchema>

/**
 * Результат расчёта
 */
export interface CalculateRackResult {
  name: string
  description: string
  configuration: CalculateRackInput
  components: RackResult['components']
  totalLength: number
  pricing: RackPricing
  rackSetId?: string
}

/**
 * Use-Case: Расчёт стеллажа с сохранением результата
 */
export class CalculateRackUseCase {
  constructor(
    private readonly rackRepository: RackRepository,
    private readonly priceService: PriceService
  ) {}

  async execute(input: CalculateRackInput, userId?: string): Promise<CalculateRackResult> {
    // 1. Валидация входных данных
    const validatedInput = calculateRackSchema.parse(input)

    // 2. Domain-расчёт компонентов
    const domainResult = calculateRack(validatedInput)

    // 3. Расчёт стоимости через PriceService
    const pricing = await this.calculatePricing(domainResult.components)

    // 4. Сохранение в БД (если пользователь авторизован)
    let rackSetId: string | undefined
    if (userId) {
      const rackEntity = await this.rackRepository.create({
        name: domainResult.name,
        description: domainResult.description,
        configuration: validatedInput,
        components: domainResult.components,
        totalLength: domainResult.totalLength,
        pricing,
        userId,
      })

      rackSetId = rackEntity.id

      // Создание первой ревизии
      if (rackSetId) {
        await this.rackRepository.createRevision(rackSetId, 1, {
          configuration: validatedInput,
          components: domainResult.components,
          pricing,
        })
      }
    }

    // 5. Возврат результата
    return {
      name: domainResult.name,
      description: domainResult.description,
      configuration: validatedInput,
      components: domainResult.components,
      totalLength: domainResult.totalLength,
      pricing,
      rackSetId,
    }
  }

  /**
   * Расчёт стоимости на основе компонентов
   */
  private async calculatePricing(components: RackResult['components']): Promise<RackPricing> {
    // Загрузка прайса
    await this.priceService.loadCurrentPrice()

    // Преобразование компонентов в формат PriceService
    const priceComponents = this.convertToPriceComponents(components)

    // Расчёт стоимости
    const { total } = this.priceService.calculateFull(priceComponents, 'ADMIN')

    return {
      base: total.base,
      withoutIsolators: total.withoutIsolators,
      zero: total.retail,
    }
  }

  /**
   * Преобразование компонентов в формат PriceService
   */
  private convertToPriceComponents(
    components: RackResult['components']
  ): Parameters<PriceService['calculateRackCost']>[0] {
    const result: Parameters<PriceService['calculateRackCost']>[0] = {}

    // Опоры
    if (components.supports && components.supports.length > 0) {
      const edge = components.supports.find((s) => s.type === 'edge')
      const intermediate = components.supports.find((s) => s.type === 'intermediate')

      result.supports = {
        edge: {
          quantity: edge?.quantity || 0,
          type: 'unknown',
        },
        intermediate: {
          quantity: intermediate?.quantity || 0,
          type: 'unknown',
        },
      }
    }

    // Балки
    if (components.beams && components.beams.length > 0) {
      result.beams = components.beams.map((beam) => ({
        length: parseInt(beam.type, 10),
        quantity: beam.quantity,
      }))
    }

    // Вертикальные стойки
    if (components.verticalStands) {
      result.uprights = {
        quantity: components.verticalStands.quantity,
        type: components.verticalStands.type,
      }
    }

    // Раскосы
    if (components.braces) {
      result.braces = {
        quantity: components.braces.quantity,
      }
    }

    // Изоляторы
    if (components.isolators) {
      result.isolators = {
        quantity: components.isolators.quantity,
      }
    }

    return result
  }
}
