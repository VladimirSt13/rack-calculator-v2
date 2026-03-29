import { PriceRepository } from '../../infrastructure/price.repository'
import type { ImportExcelItem } from '../../dtos/price-excel.dto'

interface ImportPricesInput {
  priceId: string
  items: ImportExcelItem[]
}

interface ImportPricesOutput {
  imported: number
  updated: number
}

export class ImportPricesUseCase {
  constructor(private priceRepository: PriceRepository) {}

  async execute(input: ImportPricesInput): Promise<ImportPricesOutput> {
    const { priceId, items } = input

    // 1. Отримати поточний прайс
    const price = await this.priceRepository.findById(priceId)
    if (!price) {
      throw new Error('Price not found')
    }

    // 2. Згрупувати імпорт по type+size
    const groupedItems = new Map<
      string,
      {
        type: string
        size?: string
        variants: Array<{ variant: string; price: number; weight?: number }>
      }
    >()

    for (const item of items) {
      const key = `${item.Type}_${item.Size || ''}`

      if (!groupedItems.has(key)) {
        groupedItems.set(key, {
          type: item.Type,
          size: item.Size,
          variants: [],
        })
      }

      const group = groupedItems.get(key)!

      // Визначити варіант
      let variant = ''
      if (item.Variant?.includes('Крайня') || item.Variant?.toLowerCase() === 'edge') {
        variant = 'edge'
      } else if (
        item.Variant?.includes('Проміжна') ||
        item.Variant?.toLowerCase() === 'intermediate'
      ) {
        variant = 'intermediate'
      }

      if (variant) {
        group.variants.push({
          variant,
          price: item.Price,
          weight: item.Weight,
        })
      } else {
        // Простий елемент без варіанта
        group.variants.push({
          variant: '',
          price: item.Price,
          weight: item.Weight,
        })
      }
    }

    // 3. Конвертувати в формат PriceItem
    let imported = 0
    let updated = 0

    for (const group of groupedItems.values()) {
      const newItem = {
        id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: group.type,
        size: group.size,
        variants:
          group.variants.length > 1
            ? group.variants.map((v, i) => ({
                id: `variant_${i}`,
                variant: v.variant,
                price: v.price,
                weight: v.weight,
              }))
            : undefined,
        price:
          group.variants.length === 1 && !group.variants[0].variant
            ? group.variants[0].price
            : undefined,
        weight:
          group.variants.length === 1 && !group.variants[0].variant
            ? group.variants[0].weight
            : undefined,
      }

      // Перевірити чи існує такий елемент
      const existingItem = price.items.find((i) => i.type === group.type && i.size === group.size)

      if (existingItem) {
        // Оновити існуючий
        existingItem.variants = newItem.variants
        existingItem.price = newItem.price
        existingItem.weight = newItem.weight
        updated++
      } else {
        // Додати новий
        price.items.push(newItem)
        imported++
      }
    }

    // 4. Зберегти прайс
    await this.priceRepository.update(price)

    return { imported, updated }
  }
}
