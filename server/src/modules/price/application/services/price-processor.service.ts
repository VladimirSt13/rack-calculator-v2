import * as XLSX from 'xlsx'
import type { PriceItem } from '../../domain/types'
import type { IPriceStrategy } from '../../domain/strategies/price-strategy.interface'

/**
 * Сервіс для обробки прайсів з різними стратегіями
 */
export class PriceProcessorService {
  private strategies: Map<string, IPriceStrategy> = new Map()

  /**
   * Реєстрація стратегії
   */
  registerStrategy(strategy: IPriceStrategy) {
    this.strategies.set(strategy.category, strategy)
  }

  /**
   * Отримання стратегії для категорії
   */
  getStrategy(category: string): IPriceStrategy {
    const strategy = this.strategies.get(category)
    if (!strategy) {
      throw new Error(`No strategy found for category: ${category}`)
    }
    return strategy
  }

  /**
   * Валідація елементів прайсу
   */
  validateItems(category: string, items: PriceItem[]): boolean {
    const strategy = this.getStrategy(category)
    return items.every((item) => strategy.validateItem(item))
  }

  /**
   * Сортування елементів
   */
  sortItems(category: string, items: PriceItem[]): PriceItem[] {
    const strategy = this.getStrategy(category)
    return strategy.sortItems(items)
  }

  /**
   * Отримання ціни для елемента
   */
  getPrice(category: string, item: PriceItem, variantId?: string): number {
    const strategy = this.getStrategy(category)
    return strategy.getPrice(item, variantId)
  }

  /**
   * Експорт в Excel
   */
  exportToExcel(category: string, items: PriceItem[]): Buffer {
    const strategy = this.getStrategy(category)
    const rows = items.flatMap((item) => strategy.toExportFormat(item))

    // Додати заголовок
    const header = this.getExcelHeader(category)
    rows.unshift(header)

    const worksheet = XLSX.utils.json_to_sheet(rows)

    // Налаштування ширини колонок
    worksheet['!cols'] = [
      { wch: 20 }, // Type
      { wch: 15 }, // Size/Voltage
      { wch: 15 }, // Variant/Capacity
      { wch: 15 }, // Chemistry
      { wch: 12 }, // Price
      { wch: 10 }, // Weight
    ]

    const workbook: XLSX.WorkBook = {
      SheetNames: ['Прайс'],
      Sheets: { Прайс: worksheet },
    }

    return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' }) as Buffer
  }

  /**
   * Імпорт з Excel
   */
  importFromExcel(
    category: string,
    rows: Record<string, any>[]
  ): {
    items: PriceItem[]
    imported: number
    updated: number
  } {
    const strategy = this.getStrategy(category)

    // Пропустити заголовок
    const dataRows = rows.slice(1)

    // Згрупувати по Type+Size для елементів з варіантами
    const grouped = new Map<string, PriceItem>()
    let imported = 0
    let updated = 0

    for (const row of dataRows) {
      const item = strategy.fromImportFormat(row)

      // Перевірити чи існує вже такий елемент
      const key = `${item.type}_${item.size || ''}`
      const existing = grouped.get(key)

      if (existing && item.variants) {
        // Додати варіант до існуючого елемента
        existing.variants = [...(existing.variants || []), ...item.variants]
        updated++
      } else if (existing) {
        // Оновити існуючий елемент
        existing.price = item.price
        existing.weight = item.weight
        updated++
      } else {
        // Додати новий елемент
        grouped.set(key, item)
        imported++
      }
    }

    return {
      items: Array.from(grouped.values()),
      imported,
      updated,
    }
  }

  /**
   * Отримання заголовка для Excel
   */
  private getExcelHeader(category: string): Record<string, any> {
    if (category === 'rack') {
      return {
        Type: 'Тип',
        Size: 'Розмір',
        Variant: 'Варіант',
        Price: 'Ціна (₴)',
        Weight: 'Вага (кг)',
      }
    }

    if (category === 'battery') {
      return {
        Type: 'Тип',
        Voltage: 'Напруга (V)',
        Capacity: 'Ємність (Ah)',
        Chemistry: 'Хімія',
        Price: 'Ціна (₴)',
        Weight: 'Вага (кг)',
      }
    }

    return {
      Type: 'Тип',
      Price: 'Ціна',
    }
  }
}
