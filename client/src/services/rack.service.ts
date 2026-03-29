import { api } from './api'
import type {
  RackConfiguration,
  RackResult,
  RackSet,
  RackFilters,
  RackRevision,
} from '@/types/rack'

/**
 * Опції з прайсу для калькулятора
 */
export interface RackOptions {
  supports: Array<{ value: string; label: string; stepped: boolean }>
  spans: Array<{ value: string; label: string; length: number; maxQuantity?: number }>
  verticalStands: Array<{ value: string; label: string }>
}

/**
 * Ціни компонентів з прайсу (нова структура)
 */
export interface SupportPrice {
  edge: number
  intermediate: number
}

export interface RackPrices {
  supports: Record<string, SupportPrice>
  spans: Record<string, number>
  vertical_supports: Record<string, number>
  diagonal_brace: number
  isolator: number
}

/**
 * Rack Service
 * API для работы с модулем расчёта стеллажей
 */
export const rackService = {
  /**
   * Расчёт стеллажа
   */
  calculate: async (config: RackConfiguration): Promise<RackResult> => {
    const response = await api.post<{ data: RackResult }>('/rack/calculate', config)
    return response.data.data
  },

  /**
   * Получение списка стеллажей пользователя
   */
  getMyRacks: async (filters?: RackFilters): Promise<RackSet[]> => {
    const response = await api.get<{ data: RackSet[] }>('/rack/my', { params: filters })
    return response.data.data
  },

  /**
   * Получение деталей стеллажа по ID
   */
  getRackById: async (id: string): Promise<RackSet> => {
    const response = await api.get<{ data: RackSet }>(`/rack/${id}`)
    return response.data.data
  },

  /**
   * Удаление стеллажа (soft delete)
   */
  deleteRack: async (id: string): Promise<void> => {
    await api.delete(`/rack/${id}`)
  },

  /**
   * Восстановление удалённого стеллажа
   */
  restoreRack: async (id: string): Promise<void> => {
    await api.post(`/rack/${id}/restore`)
  },

  /**
   * Получение ревизий стеллажа
   */
  getRevisions: async (rackSetId: string, limit = 10): Promise<RackRevision[]> => {
    const response = await api.get<{ data: RackRevision[] }>(`/rack/${rackSetId}/revisions`, {
      params: { limit },
    })
    return response.data.data
  },

  /**
   * Отримання доступних опцій з прайсу
   */
  getOptions: async (): Promise<RackOptions> => {
    const response = await api.get<{ data: RackOptions }>('/prices/rack/options')
    return response.data.data
  },

  /**
   * Отримання цін компонентів з прайсу (нова структура)
   */
  getPrices: async (): Promise<RackPrices | null> => {
    try {
      // Отримуємо повний прайс з items
      const response = await api.get<{
        data: {
          items: Array<{
            id: string
            type: string
            size?: string
            price?: number
            variants?: Array<{ id: string; variant: string; price: number }>
          }>
        }
      }>('/prices/rack')

      const items = response.data.data.items

      // Конвертуємо в старий формат для сумісності
      const prices: RackPrices = {
        supports: {},
        spans: {},
        vertical_supports: {},
        diagonal_brace: 0,
        isolator: 0,
      }

      for (const item of items) {
        if (item.type === 'support' && item.size && item.variants) {
          const edgeVariant = item.variants.find((v) => v.variant === 'edge')
          const intermediateVariant = item.variants.find((v) => v.variant === 'intermediate')

          if (edgeVariant && intermediateVariant) {
            prices.supports[item.size] = {
              edge: edgeVariant.price,
              intermediate: intermediateVariant.price,
            }
          }
        } else if (item.type === 'span' && item.size && item.price !== undefined) {
          prices.spans[item.size] = item.price
        } else if (item.type === 'vertical_support' && item.size && item.price !== undefined) {
          prices.vertical_supports[item.size] = item.price
        } else if (item.type === 'diagonal_brace' && item.price !== undefined) {
          prices.diagonal_brace = item.price
        } else if (item.type === 'isolator' && item.price !== undefined) {
          prices.isolator = item.price
        }
      }

      return prices
    } catch (error) {
      console.error('Failed to fetch prices:', error)
      return null
    }
  },
}
