import { create } from 'zustand'
import type { RackResult, RackSetItem, RackSetState } from '@/types/rack'

interface RackSetStore extends RackSetState {
  isSaveModalOpen: boolean
  // Дії
  addRack: (result: RackResult) => void
  incrementQuantity: (rackId: string) => void
  decrementQuantity: (rackId: string) => void
  removeRack: (rackId: string) => void
  clearSet: () => void
  openSaveModal: () => void
  closeSaveModal: () => void
  calculateTotals: () => void
}

const initialState: RackSetState & { isSaveModalOpen: boolean } = {
  items: [],
  totalZero: 0,
  totalWithoutIsolators: 0,
  isSaveModalOpen: false,
}

/**
 * Store для управління комплектом стелажів
 */
export const useRackSetStore = create<RackSetStore>((set, get) => ({
  ...initialState,

  // Додати стелаж до комплекту
  addRack: (result: RackResult) => {
    const rackId = result.rackSetId || result.name
    set((state) => {
      const existingItem = state.items.find((item) => item.rackId === rackId)

      if (existingItem) {
        // Якщо вже є, збільшуємо кількість
        return {
          items: state.items.map((item) =>
            item.rackId === rackId ? { ...item, quantity: item.quantity + 1 } : item
          ),
        }
      } else {
        // Додаємо новий
        return {
          items: [
            ...state.items,
            {
              rackId,
              name: result.name,
              quantity: 1,
              result,
              configuration: result.configuration,
            },
          ],
        }
      }
    })
    get().calculateTotals()
  },

  // Збільшити кількість
  incrementQuantity: (rackId: string) => {
    set((state) => ({
      items: state.items.map((item) =>
        item.rackId === rackId ? { ...item, quantity: item.quantity + 1 } : item
      ),
    }))
    get().calculateTotals()
  },

  // Зменшити кількість
  decrementQuantity: (rackId: string) => {
    set((state) => ({
      items: state.items
        .map((item) => (item.rackId === rackId ? { ...item, quantity: item.quantity - 1 } : item))
        .filter((item) => item.quantity > 0),
    }))
    get().calculateTotals()
  },

  // Видалити стелаж
  removeRack: (rackId: string) => {
    set((state) => ({
      items: state.items.filter((item) => item.rackId !== rackId),
    }))
    get().calculateTotals()
  },

  // Очистити комплект
  clearSet: () => {
    set({ items: [], totalZero: 0, totalWithoutIsolators: 0 })
  },

  // Розрахунок підсумкових цін
  calculateTotals: () => {
    const { items } = get()
    const totalZero = items.reduce((sum, item) => sum + item.result.pricing.zero * item.quantity, 0)
    const totalWithoutIsolators = items.reduce(
      (sum, item) => sum + item.result.pricing.withoutIsolators * item.quantity,
      0
    )
    set({ totalZero, totalWithoutIsolators })
  },

  // Модальне вікно
  openSaveModal: () => set({ isSaveModalOpen: true } as any),
  closeSaveModal: () => set({ isSaveModalOpen: false } as any),
}))
