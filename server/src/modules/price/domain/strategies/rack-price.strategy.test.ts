import { describe, it, expect } from '@jest/globals'
import { RackPriceStrategy } from './rack-price.strategy'
import type { PriceItem } from '../types'

describe('RackPriceStrategy', () => {
  const strategy = new RackPriceStrategy()

  describe('category', () => {
    it('should return "rack"', () => {
      expect(strategy.category).toBe('rack')
    })
  })

  describe('validateItem', () => {
    it('should validate support item', () => {
      const item: PriceItem = {
        id: 'support_215',
        type: 'support',
        size: '215',
        price: 600,
      }
      expect(strategy.validateItem(item)).toBe(true)
    })

    it('should validate span item', () => {
      const item: PriceItem = {
        id: 'span_600',
        type: 'span',
        size: '600',
        price: 500,
      }
      expect(strategy.validateItem(item)).toBe(true)
    })

    it('should validate vertical_support item', () => {
      const item: PriceItem = {
        id: 'vertical_support_632',
        type: 'vertical_support',
        size: '632',
        price: 630,
      }
      expect(strategy.validateItem(item)).toBe(true)
    })

    it('should validate diagonal_brace item', () => {
      const item: PriceItem = {
        id: 'diagonal_brace',
        type: 'diagonal_brace',
        price: 380,
      }
      expect(strategy.validateItem(item)).toBe(true)
    })

    it('should validate isolator item', () => {
      const item: PriceItem = {
        id: 'isolator',
        type: 'isolator',
        price: 69,
      }
      expect(strategy.validateItem(item)).toBe(true)
    })

    it('should reject invalid type', () => {
      const item: PriceItem = {
        id: 'invalid_item',
        type: 'invalid_type',
        price: 100,
      }
      expect(strategy.validateItem(item)).toBe(false)
    })
  })

  describe('getPrice', () => {
    it('should return price for simple item', () => {
      const item: PriceItem = {
        id: 'span_600',
        type: 'span',
        size: '600',
        price: 500,
      }
      expect(strategy.getPrice(item)).toBe(500)
    })

    it('should return 0 for item without price', () => {
      const item: PriceItem = {
        id: 'span_600',
        type: 'span',
        size: '600',
      }
      expect(strategy.getPrice(item)).toBe(0)
    })

    it('should return price for support with variant', () => {
      const item: PriceItem = {
        id: 'support_215',
        type: 'support',
        size: '215',
        variants: [
          {
            id: 'support_215_edge',
            variant: 'edge',
            price: 600,
            weight: 2.0,
          },
          {
            id: 'support_215_intermediate',
            variant: 'intermediate',
            price: 620,
            weight: 2.05,
          },
        ],
      }
      expect(strategy.getPrice(item, 'support_215_edge')).toBe(600)
      expect(strategy.getPrice(item, 'support_215_intermediate')).toBe(620)
    })

    it('should return 0 for non-existent variant', () => {
      const item: PriceItem = {
        id: 'support_215',
        type: 'support',
        size: '215',
        variants: [
          {
            id: 'support_215_edge',
            variant: 'edge',
            price: 600,
          },
        ],
      }
      expect(strategy.getPrice(item, 'non_existent')).toBe(0)
    })
  })

  describe('toExportFormat', () => {
    it('should export simple item', () => {
      const item: PriceItem = {
        id: 'span_600',
        type: 'span',
        size: '600',
        price: 500,
        weight: 1.6,
      }
      const result = strategy.toExportFormat(item)
      expect(result).toHaveLength(1)
      expect(result[0]).toEqual({
        Type: 'span',
        Size: '600',
        Variant: '',
        Price: 500,
        Weight: 1.6,
      })
    })

    it('should export support with variants', () => {
      const item: PriceItem = {
        id: 'support_215',
        type: 'support',
        size: '215',
        variants: [
          {
            id: 'support_215_edge',
            variant: 'edge',
            price: 600,
            weight: 2.0,
          },
          {
            id: 'support_215_intermediate',
            variant: 'intermediate',
            price: 620,
            weight: 2.05,
          },
        ],
      }
      const result = strategy.toExportFormat(item)
      expect(result).toHaveLength(2)
      expect(result[0]).toEqual({
        Type: 'support',
        Size: '215',
        Variant: 'Крайня',
        Price: 600,
        Weight: 2.0,
      })
      expect(result[1]).toEqual({
        Type: 'support',
        Size: '215',
        Variant: 'Проміжна',
        Price: 620,
        Weight: 2.05,
      })
    })
  })

  describe('fromImportFormat', () => {
    it('should import simple item', () => {
      const data = {
        Type: 'span',
        Size: '600',
        Variant: '',
        Price: '500',
        Weight: '1.6',
      }
      const result = strategy.fromImportFormat(data)
      expect(result.type).toBe('span')
      expect(result.size).toBe('600')
      expect(result.price).toBe(500)
      expect(result.weight).toBe(1.6)
      expect(result.variants).toBeUndefined()
    })

    it('should import support with edge variant', () => {
      const data = {
        Type: 'support',
        Size: '215',
        Variant: 'Крайня',
        Price: '600',
        Weight: '2.0',
      }
      const result = strategy.fromImportFormat(data)
      expect(result.type).toBe('support')
      expect(result.size).toBe('215')
      expect(result.variants).toHaveLength(1)
      expect(result.variants?.[0].variant).toBe('edge')
      expect(result.variants?.[0].price).toBe(600)
      expect(result.variants?.[0].weight).toBe(2.0)
    })

    it('should import support with intermediate variant', () => {
      const data = {
        Type: 'support',
        Size: '215',
        Variant: 'Проміжна',
        Price: '620',
        Weight: '2.05',
      }
      const result = strategy.fromImportFormat(data)
      expect(result.type).toBe('support')
      expect(result.size).toBe('215')
      expect(result.variants).toHaveLength(1)
      expect(result.variants?.[0].variant).toBe('intermediate')
      expect(result.variants?.[0].price).toBe(620)
    })
  })

  describe('sortItems', () => {
    it('should sort items by type and size', () => {
      const items: PriceItem[] = [
        { id: 'span_1500', type: 'span', size: '1500', price: 980 },
        { id: 'support_215', type: 'support', size: '215', price: 600 },
        { id: 'isolator', type: 'isolator', price: 69 },
        { id: 'span_600', type: 'span', size: '600', price: 500 },
        { id: 'support_430', type: 'support', size: '430', price: 930 },
      ]

      const sorted = strategy.sortItems(items)

      expect(sorted[0].type).toBe('support')
      expect(sorted[0].size).toBe('215')
      expect(sorted[1].type).toBe('support')
      expect(sorted[1].size).toBe('430')
      expect(sorted[2].type).toBe('span')
      expect(sorted[2].size).toBe('600')
      expect(sorted[3].type).toBe('span')
      expect(sorted[3].size).toBe('1500')
      expect(sorted[4].type).toBe('isolator')
    })

    it('should sort items with string sizes', () => {
      const items: PriceItem[] = [
        { id: 'support_430C', type: 'support', size: '430C', price: 1100 },
        { id: 'support_215', type: 'support', size: '215', price: 600 },
        { id: 'support_580C', type: 'support', size: '580C', price: 1300 },
      ]

      const sorted = strategy.sortItems(items)

      expect(sorted.map(i => i.size)).toEqual(['215', '430C', '580C'])
    })
  })
})
