import { Price } from '../domain/entities/price.entity.js'
import { PriceRepository } from './price.repository.js'
import type { PriceItem } from '../domain/types.js'

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
   * Find support item by size
   */
  findSupport(size: string): PriceItem | null {
    if (!this.currentPrice) return null

    return (
      this.currentPrice.items.find((item) => item.type === 'support' && item.size === size) || null
    )
  }

  /**
   * Find span item by length
   */
  findSpan(length: number): PriceItem | null {
    if (!this.currentPrice) return null

    return (
      this.currentPrice.items.find(
        (item) => item.type === 'span' && item.size === String(length)
      ) || null
    )
  }

  /**
   * Find vertical support by size
   */
  findVerticalSupport(size: string): PriceItem | null {
    if (!this.currentPrice) return null

    return (
      this.currentPrice.items.find(
        (item) => item.type === 'vertical_support' && item.size === size
      ) || null
    )
  }

  /**
   * Get support price by type and variant
   */
  getSupportPrice(size: string, variant: 'edge' | 'intermediate'): number | null {
    const item = this.findSupport(size)
    if (!item?.variants) return null

    const v = item.variants.find((v) => v.variant === variant)
    return v?.price ?? null
  }

  /**
   * Get span price by length
   */
  getSpanPrice(length: number): number | null {
    const item = this.findSpan(length)
    if (!item) return null

    return item.price ?? null
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

    // Supports (опори)
    if (components.supports) {
      const { edge, intermediate } = components.supports

      prices.supports = []

      // Edge support
      if (edge.quantity > 0) {
        const price = this.getSupportPrice(edge.type, 'edge')
        if (price !== null) {
          prices.supports.push({
            name: `Опора ${edge.type} (крайня)`,
            amount: edge.quantity,
            price,
            total: edge.quantity * price,
          })
        }
      }

      // Intermediate support
      if (intermediate.quantity > 0) {
        const price = this.getSupportPrice(intermediate.type, 'intermediate')
        if (price !== null) {
          prices.supports.push({
            name: `Опора ${intermediate.type} (пром)`,
            amount: intermediate.quantity,
            price,
            total: intermediate.quantity * price,
          })
        }
      }
    }

    // Beams (балки)
    if (components.beams) {
      prices.beams = components.beams.map((beam) => {
        const price = this.getSpanPrice(beam.length)
        return {
          name: `Балка ${beam.length}`,
          amount: beam.quantity,
          price: price || 0,
          total: beam.quantity * (price || 0),
        }
      })
    }

    // Uprights (вертикальні стійки)
    if (components.uprights) {
      prices.uprights = []
      if (components.uprights.quantity > 0) {
        const item = this.findVerticalSupport(components.uprights.type)
        const price = item?.price ?? null
        if (price !== null) {
          prices.uprights.push({
            name: `Вертикальна стійка ${components.uprights.type}`,
            amount: components.uprights.quantity,
            price,
            total: components.uprights.quantity * price,
          })
        }
      }
    }

    // Braces (розкоси)
    if (components.braces) {
      prices.braces = []
      const braceItem = this.currentPrice.items.find((item) => item.type === 'diagonal_brace')
      const price = braceItem?.price ?? null
      if (components.braces.quantity > 0 && price !== null) {
        prices.braces.push({
          name: 'Розкос',
          amount: components.braces.quantity,
          price,
          total: components.braces.quantity * price,
        })
      }
    }

    // Isolators (ізолятори)
    if (components.isolators) {
      prices.isolators = []
      const isolatorItem = this.currentPrice.items.find((item) => item.type === 'isolator')
      const price = isolatorItem?.price ?? null
      if (components.isolators.quantity > 0 && price !== null) {
        prices.isolators.push({
          name: 'Ізолятор',
          amount: components.isolators.quantity,
          price,
          total: components.isolators.quantity * price,
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
