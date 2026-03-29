import { api } from './api'
import type { Price, PriceSummary, PriceItem } from '@/types/price-admin'

export interface BulkUpdateItem {
  itemId: string
  variantId?: string
  price: number
}

export interface BulkUpdateResult {
  updated: number
  skipped: number
}

export const priceAdminService = {
  /**
   * Отримати всі прайси
   */
  async getAllPrices(): Promise<PriceSummary[]> {
    const { data } = await api.get('/prices/all')
    return data.data.map((p: any) => ({
      ...p,
      itemsCount: p.items?.length || 0,
    }))
  },

  /**
   * Отримати прайс по ID з повними даними
   */
  async getPriceById(id: string): Promise<Price> {
    const { data } = await api.get(`/prices/${id}`)
    return data.data
  },

  /**
   * Створити новий прайс
   */
  async createPrice(data: {
    name: string
    description?: string
    category: string
    items?: PriceItem[]
  }): Promise<Price> {
    const response = await api.post('/prices', data)
    return response.data.data
  },

  /**
   * Оновити прайс
   */
  async updatePrice(
    id: string,
    updates: {
      name?: string
      description?: string
      items?: PriceItem[]
      isActive?: boolean
    }
  ): Promise<Price> {
    const response = await api.put(`/prices/${id}`, updates)
    return response.data.data
  },

  /**
   * Масове оновлення цін
   */
  async bulkUpdatePrices(priceId: string, items: BulkUpdateItem[]): Promise<BulkUpdateResult> {
    const response = await api.put('/prices/bulk', { priceId, items })
    return response.data.data
  },

  /**
   * Активувати прайс
   */
  async activatePrice(id: string): Promise<void> {
    await api.post(`/prices/${id}/activate`)
  },

  /**
   * Деактивувати прайс
   */
  async deactivatePrice(id: string): Promise<void> {
    await api.post(`/prices/${id}/deactivate`)
  },

  /**
   * Видалити прайс
   */
  async deletePrice(id: string): Promise<void> {
    await api.delete(`/prices/${id}`)
  },

  /**
   * Додати елемент до прайсу
   */
  async addItem(priceId: string, item: PriceItem): Promise<Price> {
    const price = await this.getPriceById(priceId)
    return this.updatePrice(priceId, {
      items: [...price.items, item],
    })
  },

  /**
   * Оновити елемент в прайсі
   */
  async updateItem(priceId: string, itemId: string, updates: Partial<PriceItem>): Promise<Price> {
    const price = await this.getPriceById(priceId)
    const updatedItems = price.items.map((item) =>
      item.id === itemId ? { ...item, ...updates } : item
    )
    return this.updatePrice(priceId, { items: updatedItems })
  },

  /**
   * Видалити елемент з прайсу
   */
  async deleteItem(priceId: string, itemId: string): Promise<Price> {
    const price = await this.getPriceById(priceId)
    const updatedItems = price.items.filter((item) => item.id !== itemId)
    return this.updatePrice(priceId, { items: updatedItems })
  },
}
