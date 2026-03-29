import { PriceRepository } from '../../infrastructure/price.repository'
import type { BulkUpdatePriceItem } from '../../domain/types.js'

interface BulkUpdatePricesInput {
  priceId: string
  items: BulkUpdatePriceItem[]
}

interface BulkUpdatePricesOutput {
  updated: number
  skipped: number
}

export class BulkUpdatePricesUseCase {
  constructor(private priceRepository: PriceRepository) {}

  async execute(input: BulkUpdatePricesInput): Promise<BulkUpdatePricesOutput> {
    console.log('[BulkUpdatePricesUseCase] Input:', input)

    // 1. Отримати поточний прайс
    const price = await this.priceRepository.findById(input.priceId)
    console.log('[BulkUpdatePricesUseCase] Price found:', price?.id, price?.items?.length, 'items')

    if (!price) {
      throw new Error('Price not found')
    }

    // 2. Оновити кожну позицію
    let updated = 0
    let skipped = 0

    for (const item of input.items) {
      const { itemId, variantId, price: newPrice } = item
      console.log('[BulkUpdatePricesUseCase] Updating:', { itemId, variantId, newPrice })

      if (variantId) {
        // Оновити ціну варіанта
        const success = price.updateVariantPrice(itemId, variantId, newPrice)
        console.log('[BulkUpdatePricesUseCase] Variant update success:', success)
        if (success) {
          updated++
        } else {
          skipped++
        }
      } else {
        // Оновити ціну простого елемента
        const success = price.updateItemPrice(itemId, newPrice)
        console.log('[BulkUpdatePricesUseCase] Item update success:', success)
        if (success) {
          updated++
        } else {
          skipped++
        }
      }
    }

    // 3. Зберегти оновлений прайс
    console.log('[BulkUpdatePricesUseCase] Saving price...')
    await this.priceRepository.update(price)

    return { updated, skipped }
  }
}
