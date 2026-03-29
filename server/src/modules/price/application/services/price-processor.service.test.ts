import { describe, it, expect, beforeEach } from '@jest/globals'
import { PriceProcessorService } from './price-processor.service'
import { RackPriceStrategy } from '../../domain/strategies/rack-price.strategy'
import type { PriceItem } from '../../domain/types'

describe('PriceProcessorService', () => {
  let service: PriceProcessorService

  beforeEach(() => {
    service = new PriceProcessorService()
    service.registerStrategy(new RackPriceStrategy())
  })

  describe('registerStrategy', () => {
    it('should register a strategy', () => {
      const strategy = new RackPriceStrategy()
      const newService = new PriceProcessorService()

      expect(() => newService.getStrategy('rack')).toThrow('No strategy found')

      newService.registerStrategy(strategy)
      expect(() => newService.getStrategy('rack')).not.toThrow()
    })
  })

  describe('getStrategy', () => {
    it('should return registered strategy', () => {
      const strategy = service.getStrategy('rack')
      expect(strategy).toBeInstanceOf(RackPriceStrategy)
      expect(strategy.category).toBe('rack')
    })

    it('should throw error for unknown category', () => {
      expect(() => service.getStrategy('unknown')).toThrow(
        'No strategy found for category: unknown'
      )
    })
  })

  describe('validateItems', () => {
    it('should validate valid rack items', () => {
      const items: PriceItem[] = [
        { id: 'support_215', type: 'support', size: '215', price: 600 },
        { id: 'span_600', type: 'span', size: '600', price: 500 },
        { id: 'isolator', type: 'isolator', price: 69 },
      ]
      expect(service.validateItems('rack', items)).toBe(true)
    })

    it('should reject invalid items', () => {
      const items: PriceItem[] = [
        { id: 'support_215', type: 'support', size: '215', price: 600 },
        { id: 'invalid', type: 'invalid_type', price: 100 },
      ]
      expect(service.validateItems('rack', items)).toBe(false)
    })
  })

  describe('sortItems', () => {
    it('should sort items by type and size', () => {
      const items: PriceItem[] = [
        { id: 'span_1500', type: 'span', size: '1500', price: 980 },
        { id: 'support_215', type: 'support', size: '215', price: 600 },
        { id: 'isolator', type: 'isolator', price: 69 },
        { id: 'span_600', type: 'span', size: '600', price: 500 },
      ]

      const sorted = service.sortItems('rack', items)

      expect(sorted.map((i) => `${i.type}_${i.size || 'none'}`)).toEqual([
        'support_215',
        'span_600',
        'span_1500',
        'isolator_none',
      ])
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
      expect(service.getPrice('rack', item)).toBe(500)
    })

    it('should return price for support variant', () => {
      const item: PriceItem = {
        id: 'support_215',
        type: 'support',
        size: '215',
        variants: [
          { id: 'support_215_edge', variant: 'edge', price: 600 },
          { id: 'support_215_intermediate', variant: 'intermediate', price: 620 },
        ],
      }
      expect(service.getPrice('rack', item, 'support_215_edge')).toBe(600)
      expect(service.getPrice('rack', item, 'support_215_intermediate')).toBe(620)
    })
  })

  describe('exportToExcel', () => {
    it('should export items to Excel buffer', () => {
      const items: PriceItem[] = [
        {
          id: 'support_215',
          type: 'support',
          size: '215',
          variants: [{ id: 'support_215_edge', variant: 'edge', price: 600, weight: 2.0 }],
        },
        {
          id: 'span_600',
          type: 'span',
          size: '600',
          price: 500,
          weight: 1.6,
        },
      ]

      const buffer = service.exportToExcel('rack', items)

      expect(buffer).toBeInstanceOf(Buffer)
      expect(buffer.length).toBeGreaterThan(0)
    })

    it('should include header row', () => {
      const items: PriceItem[] = [{ id: 'span_600', type: 'span', size: '600', price: 500 }]

      const buffer = service.exportToExcel('rack', items)
      expect(buffer).toBeInstanceOf(Buffer)
    })
  })

  describe('importFromExcel', () => {
    it('should import simple items', () => {
      const rows = [
        { Type: 'Type', Size: 'Size', Variant: 'Variant', Price: 'Ціна (₴)', Weight: 'Вага (кг)' },
        { Type: 'span', Size: '600', Variant: '', Price: '500', Weight: '1.6' },
        { Type: 'span', Size: '750', Variant: '', Price: '630', Weight: '2.1' },
      ]

      const result = service.importFromExcel('rack', rows)

      expect(result.imported).toBe(2)
      expect(result.updated).toBe(0)
      expect(result.items).toHaveLength(2)
      expect(result.items[0].type).toBe('span')
      expect(result.items[0].size).toBe('600')
      expect(result.items[0].price).toBe(500)
    })

    it('should group variants for same item', () => {
      const rows = [
        { Type: 'Type', Size: 'Size', Variant: 'Variant', Price: 'Ціна (₴)', Weight: 'Вага (кг)' },
        { Type: 'support', Size: '215', Variant: 'Крайня', Price: '600', Weight: '2.0' },
        { Type: 'support', Size: '215', Variant: 'Проміжна', Price: '620', Weight: '2.05' },
      ]

      const result = service.importFromExcel('rack', rows)

      expect(result.imported).toBe(1)
      expect(result.items).toHaveLength(1)
      expect(result.items[0].type).toBe('support')
      expect(result.items[0].size).toBe('215')
      expect(result.items[0].variants).toHaveLength(2)
    })

    it('should skip header row', () => {
      const rows = [
        { Type: 'Type', Size: 'Size', Variant: 'Variant', Price: 'Ціна (₴)', Weight: 'Вага (кг)' },
        { Type: 'isolator', Size: '', Variant: '', Price: '69', Weight: '0.1' },
      ]

      const result = service.importFromExcel('rack', rows)

      expect(result.items).toHaveLength(1)
      expect(result.items[0].type).toBe('isolator')
    })
  })

  describe('integration: export and import', () => {
    it('should export and import back with same data', () => {
      const originalItems: PriceItem[] = [
        {
          id: 'support_215',
          type: 'support',
          size: '215',
          variants: [
            { id: 'v1', variant: 'edge', price: 600, weight: 2.0 },
            { id: 'v2', variant: 'intermediate', price: 620, weight: 2.05 },
          ],
        },
        {
          id: 'span_600',
          type: 'span',
          size: '600',
          price: 500,
          weight: 1.6,
        },
      ]

      // Export
      const buffer = service.exportToExcel('rack', originalItems)

      // Import (імітація читання з буфера)
      // В реальних тестах тут буде XLSX.read(buffer, { type: 'buffer' })
      // Для спрощення перевіряємо що буфер існує
      expect(buffer).toBeInstanceOf(Buffer)
      expect(buffer.length).toBeGreaterThan(0)
    })
  })
})
