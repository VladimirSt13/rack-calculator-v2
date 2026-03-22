export interface PriceComponent {
  code: string
  name: string
  price: number
  weight?: number | null
  category: string
}

export interface SupportType {
  edge: PriceComponent
  intermediate: PriceComponent
}

export interface PriceData {
  supports: Record<string, SupportType> // { "215": { edge: {...}, intermediate: {...} } }
  spans: Record<string, PriceComponent> // { "600": {...}, "750": {...} }
  vertical_supports: Record<string, PriceComponent>
  diagonal_brace: PriceComponent
  isolator: PriceComponent
}

export interface PriceProps {
  id?: string
  category: string
  data: PriceData
  isActive?: boolean
  validFrom?: Date
  validUntil?: Date
  createdAt?: Date
  updatedAt?: Date
}

export class Price {
  public readonly id: string
  public category: string
  public data: PriceData
  public isActive: boolean
  public validFrom?: Date
  public validUntil?: Date
  public readonly createdAt: Date
  public updatedAt: Date

  constructor(props: PriceProps) {
    this.id = props.id || crypto.randomUUID()
    this.category = props.category
    this.data = props.data
    this.isActive = props.isActive ?? true
    this.validFrom = props.validFrom
    this.validUntil = props.validUntil
    this.createdAt = props.createdAt || new Date()
    this.updatedAt = props.updatedAt || new Date()
  }

  /**
   * Get component price by category and key
   * e.g., getComponentPrice('supports', '430 кр')
   */
  getComponentPrice(category: string, key: string): number | null {
    const categoryData = this.data[category as keyof PriceData]
    if (!categoryData || typeof categoryData !== 'object') {
      return null
    }

    const component = (categoryData as Record<string, PriceComponent>)[key]
    return component?.price ?? null
  }

  /**
   * Get component by category and key
   */
  getComponent(category: string, key: string): PriceComponent | null {
    const categoryData = this.data[category as keyof PriceData]
    if (!categoryData || typeof categoryData !== 'object') {
      return null
    }

    return (categoryData as Record<string, PriceComponent>)[key] || null
  }

  /**
   * Update price data
   */
  updateData(data: PriceData): void {
    this.data = data
    this.updatedAt = new Date()
  }

  /**
   * Activate price list
   */
  activate(): void {
    this.isActive = true
    this.updatedAt = new Date()
  }

  /**
   * Deactivate price list
   */
  deactivate(): void {
    this.isActive = false
    this.updatedAt = new Date()
  }

  /**
   * Check if price list is currently valid
   */
  isValidNow(): boolean {
    if (!this.isActive) return false

    const now = new Date()
    if (this.validFrom && now < this.validFrom) return false
    if (this.validUntil && now > this.validUntil) return false

    return true
  }

  toPersistence() {
    return {
      id: this.id,
      category: this.category,
      data: this.data,
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
      category: data.category,
      data: data.data as PriceData,
      isActive: data.isActive,
      validFrom: data.validFrom,
      validUntil: data.validUntil,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    })
  }
}
