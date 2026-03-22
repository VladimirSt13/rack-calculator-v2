import { Price } from '../domain/entities/price.entity.js'
import { PriceRepository } from './price.repository.js'

export interface RackComponentPrice {
  name: string
  amount: number
  price: number
  total: number
}

export interface RackPrices {
  supports?: RackComponentPrice[]
  beams?: RackComponentPrice[]
  uprights?: RackComponentPrice[]
  braces?: RackComponentPrice[]
  isolators?: RackComponentPrice[]
}

export interface TotalCost {
  base: number
  withoutIsolators: number
  retail: number
}

export interface PriceDisplay {
  type: string
  label: string
  value: number
}

/**
 * PriceService - бізнес-логіка розрахунку вартості
 */
export class PriceService {
  private currentPrice: Price | null = null

  constructor(private readonly priceRepository: PriceRepository) {}

  /**
   * Load current price list
   */
  async loadCurrentPrice(): Promise<void> {
    this.currentPrice = await this.priceRepository.findActiveByCategory('rack')
  }

  /**
   * Get current price list
   */
  getCurrentPrice(): Price | null {
    return this.currentPrice
  }

  /**
   * Get component price
   */
  getComponentPrice(category: string, key: string): number | null {
    if (!this.currentPrice) {
      throw new Error('Price list not loaded')
    }

    return this.currentPrice.getComponentPrice(category, key)
  }

  /**
   * Calculate rack components cost
   */
  calculateRackCost(components: {
    supports?: {
      edge: { quantity: number; type: string }
      intermediate: { quantity: number; type: string }
    }
    beams?: Array<{ length: number; quantity: number }>
    uprights?: { quantity: number; type: string }
    braces?: { quantity: number }
    isolators?: { quantity: number }
  }): RackPrices {
    if (!this.currentPrice) {
      throw new Error('Price list not loaded')
    }

    const prices: RackPrices = {}

    // Supports (опори) - нова структура: supports[type].edge / supports[type].intermediate
    if (components.supports) {
      const { edge, intermediate } = components.supports
      const supportsData = this.currentPrice.data.supports || {}

      prices.supports = []

      // Edge support
      if (edge.quantity > 0 && supportsData[edge.type]) {
        const edgeComponent = supportsData[edge.type].edge
        if (edgeComponent) {
          prices.supports.push({
            name: `Опора ${edge.type} (крайня)`,
            amount: edge.quantity,
            price: edgeComponent.price,
            total: edge.quantity * edgeComponent.price,
          })
        }
      }

      // Intermediate support
      if (intermediate.quantity > 0 && supportsData[intermediate.type]) {
        const intermediateComponent = supportsData[intermediate.type].intermediate
        if (intermediateComponent) {
          prices.supports.push({
            name: `Опора ${intermediate.type} (пром)`,
            amount: intermediate.quantity,
            price: intermediateComponent.price,
            total: intermediate.quantity * intermediateComponent.price,
          })
        }
      }
    }

    // Beams (балки)
    if (components.beams) {
      const spansData = this.currentPrice.data.spans || {}
      prices.beams = components.beams.map((beam) => {
        const beamComponent = spansData[String(beam.length)]
        return {
          name: `Балка ${beam.length}`,
          amount: beam.quantity,
          price: beamComponent?.price || 0,
          total: beam.quantity * (beamComponent?.price || 0),
        }
      })
    }

    // Uprights (вертикальні стійки)
    if (components.uprights) {
      const uprightsData = this.currentPrice.data.vertical_supports || {}
      const uprightComponent = uprightsData[components.uprights.type]
      prices.uprights = []
      if (components.uprights.quantity > 0 && uprightComponent) {
        prices.uprights.push({
          name: `Вертикальна стійка ${components.uprights.type}`,
          amount: components.uprights.quantity,
          price: uprightComponent.price,
          total: components.uprights.quantity * uprightComponent.price,
        })
      }
    }

    // Braces (розкоси)
    if (components.braces) {
      const braceComponent = this.currentPrice.data.diagonal_brace
      prices.braces = []
      if (components.braces.quantity > 0 && braceComponent) {
        prices.braces.push({
          name: 'Розкос',
          amount: components.braces.quantity,
          price: braceComponent.price,
          total: components.braces.quantity * braceComponent.price,
        })
      }
    }

    // Isolators (ізолятори)
    if (components.isolators) {
      const isolatorComponent = this.currentPrice.data.isolator
      prices.isolators = []
      if (components.isolators.quantity > 0 && isolatorComponent) {
        prices.isolators.push({
          name: 'Ізолятор',
          amount: components.isolators.quantity,
          price: isolatorComponent.price,
          total: components.isolators.quantity * isolatorComponent.price,
        })
      }
    }

    return prices
  }

  /**
   * Calculate total cost
   */
  calculateTotal(prices: RackPrices): TotalCost {
    let base = 0

    // Sum all components
    if (prices.supports) {
      base += prices.supports.reduce((sum, item) => sum + item.total, 0)
    }
    if (prices.beams) {
      base += prices.beams.reduce((sum, item) => sum + item.total, 0)
    }
    if (prices.uprights) {
      base += prices.uprights.reduce((sum, item) => sum + item.total, 0)
    }
    if (prices.braces) {
      base += prices.braces.reduce((sum, item) => sum + item.total, 0)
    }
    if (prices.isolators) {
      base += prices.isolators.reduce((sum, item) => sum + item.total, 0)
    }

    const isolatorsCost = prices.isolators?.reduce((sum, item) => sum + item.total, 0) || 0
    const withoutIsolators = base - isolatorsCost
    const retail = base * 1.44

    return {
      base: Math.round(base),
      withoutIsolators: Math.round(withoutIsolators),
      retail: Math.round(retail),
    }
  }

  /**
   * Get prices by user role
   */
  getPricesByRole(total: TotalCost, userRole: 'USER' | 'ADMIN' | 'MANAGER'): PriceDisplay[] {
    switch (userRole) {
      case 'ADMIN':
        return [
          { type: 'base', label: 'Базова ціна', value: total.base },
          { type: 'withoutIsolators', label: 'Без ізоляторів', value: total.withoutIsolators },
          { type: 'retail', label: 'Нульова ціна', value: total.retail },
        ]

      case 'MANAGER':
        return [{ type: 'retail', label: 'Нульова ціна', value: total.retail }]

      case 'USER':
      default:
        return []
    }
  }

  /**
   * Full calculation: components → prices → total → by role
   */
  calculateFull(
    components: Parameters<typeof this.calculateRackCost>[0],
    userRole: 'USER' | 'ADMIN' | 'MANAGER'
  ): {
    componentPrices: RackPrices
    total: TotalCost
    displayPrices: PriceDisplay[]
  } {
    const componentPrices = this.calculateRackCost(components)
    const total = this.calculateTotal(componentPrices)
    const displayPrices = this.getPricesByRole(total, userRole)

    return {
      componentPrices,
      total,
      displayPrices,
    }
  }
}
