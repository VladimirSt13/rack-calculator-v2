import type { PriceItem, PriceVariant } from '../types'
import type { IPriceStrategy } from './price-strategy.interface'

/**
 * Стратегія обробки прайсів для стелажів (Rack)
 */
export class RackPriceStrategy implements IPriceStrategy {
  category = 'rack'

  private validTypes = ['support', 'span', 'vertical_support', 'diagonal_brace', 'isolator']

  /**
   * Валідація елемента прайсу
   */
  validateItem(item: PriceItem): boolean {
    return this.validTypes.includes(item.type)
  }

  /**
   * Отримання ціни для елемента
   */
  getPrice(item: PriceItem, variantId?: string): number {
    if (item.type === 'support' && variantId && item.variants) {
      const variant = item.variants.find((v) => v.id === variantId)
      return variant?.price || 0
    }
    return item.price || 0
  }

  /**
   * Конвертація для експорту в Excel
   */
  toExportFormat(item: PriceItem): Record<string, any>[] {
    if (item.type === 'support' && item.variants) {
      return item.variants.map((v: PriceVariant) => ({
        Type: item.type,
        Size: item.size,
        Variant: v.variant === 'edge' ? 'Крайня' : 'Проміжна',
        Price: v.price,
        Weight: v.weight || '',
      }))
    }

    return [
      {
        Type: item.type,
        Size: item.size || '',
        Variant: '',
        Price: item.price || 0,
        Weight: item.weight || '',
      },
    ]
  }

  /**
   * Конвертація з імпорту з Excel
   */
  fromImportFormat(data: Record<string, any>): PriceItem {
    const type = data.Type as string
    const size = data.Size?.toString() || ''
    const variant = data.Variant?.toString() || ''
    const price = parseFloat(data.Price) || 0
    const weight = data.Weight ? parseFloat(data.Weight) : undefined

    const item: PriceItem = {
      id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      size,
      price: variant ? undefined : price,
      weight: variant ? undefined : weight,
    }

    if (variant) {
      item.variants = [
        {
          id: `variant_${Date.now()}`,
          variant: variant.toLowerCase().includes('крайн') ? 'edge' : 'intermediate',
          price,
          weight,
        },
      ]
    }

    return item
  }

  /**
   * Сортування елементів
   */
  sortItems(items: PriceItem[]): PriceItem[] {
    const typeOrder: Record<string, number> = {
      support: 1,
      span: 2,
      vertical_support: 3,
      diagonal_brace: 4,
      isolator: 5,
    }

    return items.sort((a, b) => {
      const typeDiff = (typeOrder[a.type] || 99) - (typeOrder[b.type] || 99)
      if (typeDiff !== 0) return typeDiff

      const aNum = parseFloat(a.size || '0')
      const bNum = parseFloat(b.size || '0')

      if (!isNaN(aNum) && !isNaN(bNum)) {
        return aNum - bNum
      }

      return (a.size || '').localeCompare(b.size || '')
    })
  }
}
