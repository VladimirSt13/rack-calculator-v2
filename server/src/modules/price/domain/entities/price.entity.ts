import type { PriceItem, PriceVariant } from '../types.js'

export interface PriceProps {
  id?: string
  name?: string
  description?: string
  category: string
  items: PriceItem[]
  isActive?: boolean
  validFrom?: Date
  validUntil?: Date
  createdAt?: Date
  updatedAt?: Date
}

export class Price {
  public readonly id: string
  public name?: string
  public description?: string
  public category: string
  public items: PriceItem[]
  public isActive: boolean
  public validFrom?: Date
  public validUntil?: Date
  public readonly createdAt: Date
  public updatedAt: Date

  constructor(props: PriceProps) {
    this.id = props.id || crypto.randomUUID()
    this.name = props.name
    this.description = props.description
    this.category = props.category
    this.items = props.items
    this.isActive = props.isActive ?? true
    this.validFrom = props.validFrom
    this.validUntil = props.validUntil
    this.createdAt = props.createdAt || new Date()
    this.updatedAt = props.updatedAt || new Date()
  }

  /**
   * Знайти елемент по ID
   */
  findItem(itemId: string): PriceItem | null {
    return this.items.find((item) => item.id === itemId) || null
  }

  /**
   * Знайти варіант елемента по ID елемента та ID варіанта
   */
  findVariant(itemId: string, variantId: string): PriceVariant | null {
    const item = this.findItem(itemId)
    if (!item?.variants) return null

    return item.variants.find((v: PriceVariant) => v.id === variantId) || null
  }

  /**
   * Отримати ціну для елемента
   */
  getPrice(itemId: string, variantId?: string): number | null {
    if (!variantId) {
      // Простий елемент без варіантів
      const item = this.findItem(itemId)
      return item?.price ?? null
    }

    // Елемент з варіантами
    const variant = this.findVariant(itemId, variantId)
    return variant?.price ?? null
  }

  /**
   * Оновити ціну варіанта
   */
  updateVariantPrice(itemId: string, variantId: string, newPrice: number): boolean {
    const item = this.findItem(itemId)
    if (!item?.variants) return false

    const variant = item.variants.find((v: PriceVariant) => v.id === variantId)
    if (!variant) return false

    variant.price = newPrice
    this.updatedAt = new Date()
    return true
  }

  /**
   * Оновити ціну простого елемента
   */
  updateItemPrice(itemId: string, newPrice: number): boolean {
    const item = this.findItem(itemId)
    if (!item || item.variants) return false

    item.price = newPrice
    this.updatedAt = new Date()
    return true
  }

  /**
   * Активувати прайс
   */
  activate(): void {
    this.isActive = true
    this.updatedAt = new Date()
  }

  /**
   * Деактивувати прайс
   */
  deactivate(): void {
    this.isActive = false
    this.updatedAt = new Date()
  }

  toPersistence() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      category: this.category,
      items: this.items,
      isActive: this.isActive,
      validFrom: this.validFrom,
      validUntil: this.validUntil,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    }
  }

  static fromPersistence(data: any): Price {
    return new Price({
      id: data.id,
      name: data.name,
      description: data.description,
      category: data.category,
      items: data.items || [],
      isActive: data.isActive,
      validFrom: data.validFrom,
      validUntil: data.validUntil,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    })
  }
}
