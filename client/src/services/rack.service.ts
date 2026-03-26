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
 * Ціни компонентів з прайсу
 */
export interface RackPrices {
  supports: Record<string, { edge: { price: number }; intermediate: { price: number } }>
  spans: Record<string, { price: number }>
  vertical_supports: Record<string, { price: number }>
  diagonal_brace: { price: number }
  isolator: { price: number }
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
   * Отримання цін компонентів з прайсу
   */
  getPrices: async (): Promise<RackPrices | null> => {
    try {
      const response = await api.get<{ data: RackPrices }>('/prices/rack')
      return response.data.data
    } catch (error) {
      console.error('Failed to fetch prices:', error)
      return null
    }
  },
}
