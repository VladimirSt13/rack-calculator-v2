import { PriceRepository } from '../../infrastructure/price.repository'
import * as XLSX from 'xlsx'

interface ExportPricesInput {
  priceId: string
}

export class ExportPricesUseCase {
  constructor(private priceRepository: PriceRepository) {}

  async execute(input: ExportPricesInput): Promise<Buffer> {
    // 1. Отримати прайс
    const price = await this.priceRepository.findById(input.priceId)
    if (!price) {
      throw new Error('Price not found')
    }

    // 2. Підготувати дані для експорту
    const rows: any[] = []

    // Додати заголовок
    rows.push({
      Type: 'Тип',
      Size: 'Розмір',
      Variant: 'Варіант',
      Price: 'Ціна (₴)',
      Weight: 'Вага (кг)',
    })

    // Додати дані
    for (const item of price.items) {
      if (item.variants && item.variants.length > 0) {
        // Елемент з варіантами (напр. опори)
        for (const variant of item.variants) {
          rows.push({
            Type: item.type,
            Size: item.size || '',
            Variant: variant.variant === 'edge' ? 'Крайня' : 'Проміжна',
            Price: variant.price,
            Weight: variant.weight || '',
          })
        }
      } else {
        // Простий елемент
        rows.push({
          Type: item.type,
          Size: item.size || '',
          Variant: '',
          Price: item.price || 0,
          Weight: item.weight || '',
        })
      }
    }

    // 3. Створити worksheet
    const worksheet = XLSX.utils.json_to_sheet(rows)

    // Налаштування ширини колонок
    worksheet['!cols'] = [
      { wch: 20 }, // Type
      { wch: 10 }, // Size
      { wch: 15 }, // Variant
      { wch: 12 }, // Price
      { wch: 10 }, // Weight
    ]

    // 4. Створити workbook
    const workbook: XLSX.WorkBook = {
      SheetNames: ['Прайс'],
      Sheets: {
        'Прайс': worksheet,
      },
    }

    // 5. Експортувати в буфер
    const buffer = XLSX.write(workbook, { 
      type: 'buffer', 
      bookType: 'xlsx',
    }) as Buffer

    return buffer
  }
}
