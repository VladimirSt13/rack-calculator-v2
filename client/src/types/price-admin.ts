/**
 * Типи для адмін-панелі управління прайсами
 */

export interface PriceVariant {
  id: string
  variant: string
  price: number
  weight?: number | null
}

export interface PriceItem {
  id: string
  type: string
  size?: string
  code?: string
  name?: string
  price?: number
  weight?: number | null
  variants?: PriceVariant[]
}

export interface Price {
  id: string
  name?: string
  description?: string
  category: string
  items: PriceItem[]
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface PriceSummary {
  id: string
  name?: string
  category: string
  isActive: boolean
  itemsCount: number
  updatedAt: string
}

export interface PriceEditForm {
  name: string
  description: string
  category: string
  isActive: boolean
}

export interface PriceItemForm {
  id: string
  type: string
  size: string
  price?: number
  weight?: number
  variants: PriceVariantForm[]
}

export interface PriceVariantForm {
  id: string
  variant: string
  price: number
  weight?: number
}

export type ItemOperation = 'add' | 'edit' | 'delete'
