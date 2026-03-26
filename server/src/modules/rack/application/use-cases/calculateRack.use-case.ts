import { z } from 'zod'
import { RackRepository } from '../../infrastructure/rack.repository'
import { PriceService } from '../../../price/infrastructure/price.service'
import { calculateRack } from '../../domain/calculateRack'
import type { RackPricing } from '../../domain/entities/rack.entity'
import type { RackResult } from '../../domain/calculateRack'

/**
 * Вхідна схема для валідації
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
 * Результат розрахунку
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
 * Use-Case: Розрахунок стелажа зі збереженням результату
 */
export class CalculateRackUseCase {
  constructor(
    private readonly rackRepository: RackRepository,
    private readonly priceService: PriceService
  ) {}

  async execute(input: CalculateRackInput, userId?: string): Promise<CalculateRackResult> {
    // 1. Валідація вхідних даних
    const validatedInput = calculateRackSchema.parse(input)

    // 2. Domain-розрахунок компонентів
    const domainResult = calculateRack(validatedInput)

    // 3. Розрахунок цін компонентів
    const componentsWithPrices = await this.calculateComponentPrices(
      domainResult.components,
      validatedInput
    )

    // 4. Розрахунок вартості через PriceService
    const pricing = await this.calculatePricing(domainResult.components, validatedInput)

    // 5. Збереження в БД (якщо користувач авторизований)
    let rackSetId: string | undefined
    if (userId) {
      const rackEntity = await this.rackRepository.create({
        name: domainResult.name,
        description: domainResult.description,
        configuration: validatedInput,
        components: componentsWithPrices, // Зберігаємо з цінами
        totalLength: domainResult.totalLength,
        pricing,
        userId,
      })

      rackSetId = rackEntity.id

      // Створення першої ревізії
      if (rackSetId) {
        await this.rackRepository.createRevision(rackSetId, 1, {
          configuration: validatedInput,
          components: componentsWithPrices,
          pricing,
        })
      }
    }

    // 6. Повернення результату
    return {
      name: domainResult.name,
      description: domainResult.description,
      configuration: validatedInput,
      components: componentsWithPrices, // Повертаємо з цінами
      totalLength: domainResult.totalLength,
      pricing,
      rackSetId,
    }
  }

  /**
   * Розрахунок вартості на основі компонентів
   */
  private async calculatePricing(
    components: RackResult['components'],
    configuration?: CalculateRackInput
  ): Promise<RackPricing> {
    // Завантаження прайсу
    await this.priceService.loadCurrentPrice()

    // Перетворення компонентів у формат PriceService
    const priceComponents = configuration
      ? this.convertToPriceComponents(components, configuration)
      : this.convertToPriceComponentsOld(components)

    // Розрахунок вартості
    const { total } = this.priceService.calculateFull(priceComponents, 'ADMIN')

    return {
      base: total.base,
      withoutIsolators: total.withoutIsolators,
      zero: total.retail,
    }
  }

  /**
   * Перетворення компонентів у формат PriceService (стара версія без configuration)
   */
  private convertToPriceComponentsOld(
    components: RackResult['components']
  ): Parameters<PriceService['calculateRackCost']>[0] {
    const result: Parameters<PriceService['calculateRackCost']>[0] = {}

    if (components.supports && components.supports.length > 0) {
      const edge = components.supports.find((s) => s.type === 'edge')
      const intermediate = components.supports.find((s) => s.type === 'intermediate')

      result.supports = {
        edge: { quantity: edge?.quantity || 0, type: 'C80' },
        intermediate: { quantity: intermediate?.quantity || 0, type: 'C80' },
      }
    }

    if (components.beams && components.beams.length > 0) {
      result.beams = components.beams.map((beam) => ({
        length: parseInt(beam.type, 10),
        quantity: beam.quantity,
      }))
    }

    if (components.verticalStands) {
      result.uprights = {
        quantity: components.verticalStands.quantity,
        type: components.verticalStands.type,
      }
    }

    if (components.braces) {
      result.braces = { quantity: components.braces.quantity }
    }

    if (components.isolators) {
      result.isolators = { quantity: components.isolators.quantity }
    }

    return result
  }

  /**
   * Розрахунок цін компонентів
   */
  private async calculateComponentPrices(
    components: RackResult['components'],
    configuration: CalculateRackInput
  ): Promise<RackResult['components']> {
    // Завантаження прайсу
    await this.priceService.loadCurrentPrice()

    // Отримання цін через PriceService
    const rackPrices = this.priceService.calculateRackCost(
      this.convertToPriceComponents(components, configuration)
    )

    // Повертаємо компоненти з цінами
    return {
      supports:
        rackPrices.supports?.map((s) => ({
          type: s.name.includes('крайня') ? 'edge' : 'intermediate',
          quantity: s.amount,
          price: s.price,
          total: s.total,
        })) || [],
      beams:
        rackPrices.beams?.map((b) => ({
          type: b.name.replace('Балка ', '').replace(' мм', ''),
          quantity: b.amount,
          price: b.price,
          total: b.total,
        })) || [],
      verticalStands: rackPrices.uprights
        ? {
            type: rackPrices.uprights[0]?.name.replace('Вертикальна стійка ', '') || 'unknown',
            quantity: rackPrices.uprights[0].amount,
            price: rackPrices.uprights[0].price,
            total: rackPrices.uprights[0].total,
          }
        : undefined,
      braces: rackPrices.braces
        ? {
            quantity: rackPrices.braces[0].amount,
            price: rackPrices.braces[0].price,
            total: rackPrices.braces[0].total,
          }
        : undefined,
      isolators: rackPrices.isolators
        ? {
            quantity: rackPrices.isolators[0].amount,
            price: rackPrices.isolators[0].price,
            total: rackPrices.isolators[0].total,
          }
        : undefined,
    }
  }

  /**
   * Перетворення компонентів у формат PriceService
   */
  private convertToPriceComponents(
    components: RackResult['components'],
    configuration: CalculateRackInput
  ): Parameters<PriceService['calculateRackCost']>[0] {
    const result: Parameters<PriceService['calculateRackCost']>[0] = {}

    // Опори - використовуємо supportType з configuration
    if (components.supports && components.supports.length > 0) {
      const edge = components.supports.find((s) => s.type === 'edge')
      const intermediate = components.supports.find((s) => s.type === 'intermediate')

      result.supports = {
        edge: {
          quantity: edge?.quantity || 0,
          type: configuration.supportType,
        },
        intermediate: {
          quantity: intermediate?.quantity || 0,
          type: configuration.supportType,
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

    // Вертикальні стійки
    if (components.verticalStands) {
      result.uprights = {
        quantity: components.verticalStands.quantity,
        type: components.verticalStands.type,
      }
    }

    // Розкоси
    if (components.braces) {
      result.braces = {
        quantity: components.braces.quantity,
      }
    }

    // Ізолятори
    if (components.isolators) {
      result.isolators = {
        quantity: components.isolators.quantity,
      }
    }

    return result
  }
}
