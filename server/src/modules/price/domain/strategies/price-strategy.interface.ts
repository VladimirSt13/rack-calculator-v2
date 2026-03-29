import type { PriceItem } from '../types'

/**
 * Інтерфейс стратегії обробки прайсів
 */
export interface IPriceStrategy {
  /**
   * Категорія прайсу
   */
  category: string

  /**
   * Валідація елемента прайсу
   */
  validateItem(item: PriceItem): boolean

  /**
   * Отримання ціни для елемента
   */
  getPrice(item: PriceItem, variantId?: string): number

  /**
   * Конвертація для експорту в Excel
   */
  toExportFormat(item: PriceItem): Record<string, any>[]

  /**
   * Конвертація з імпорту з Excel
   */
  fromImportFormat(data: Record<string, any>): PriceItem

  /**
   * Сортування елементів
   */
  sortItems(items: PriceItem[]): PriceItem[]
}
