import { Router, Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { PriceRepository } from '../infrastructure/price.repository'
import { PriceService } from '../infrastructure/price.service'
import { Price } from '../domain/entities/price.entity'
import { BulkUpdatePricesUseCase } from '../application/use-cases/bulk-update-prices.use-case'
import { PriceProcessorService } from '../application/services/price-processor.service'
import { RackPriceStrategy } from '../domain/strategies/rack-price.strategy'
import { upload } from '../../../common/middleware/upload.middleware'
import * as XLSX from 'xlsx'

/**
 * Отримати доступні типи компонентів з прайсу
 */
export const createPricesRouter = () => {
  const router = Router()
  const prisma = new PrismaClient()
  const priceRepository = new PriceRepository(prisma)
  const priceService = new PriceService(priceRepository)

  // Ініціалізація стратегій
  const priceProcessor = new PriceProcessorService()
  priceProcessor.registerStrategy(new RackPriceStrategy())
  // priceProcessor.registerStrategy(new BatteryPriceStrategy()) // Майбутній

  /**
   * GET /api/prices
   * Get all active price lists
   */
  router.get('/', async (_req: Request, res: Response, next) => {
    try {
      await priceService.loadCurrentPrice()
      const prices = await priceRepository.findActive()

      res.json({
        success: true,
        data: prices.map((p: Price) => ({
          id: p.id,
          name: p.name || p.category,
          category: p.category,
          isActive: p.isActive,
          updatedAt: p.updatedAt,
        })),
      })
    } catch (error) {
      next(error)
    }
  })

  /**
   * GET /api/prices/all
   * Get all price lists (including inactive) - ADMIN only
   */
  router.get('/all', async (_req: Request, res: Response, next) => {
    try {
      const prices = await priceRepository.findAll()

      res.json({
        success: true,
        data: prices.map((p: Price) => ({
          id: p.id,
          name: p.name || p.category,
          description: p.description,
          category: p.category,
          isActive: p.isActive,
          createdAt: p.createdAt,
          updatedAt: p.updatedAt,
        })),
      })
    } catch (error) {
      next(error)
    }
  })

  /**
   * GET /api/prices/:id
   * Get price list by ID with full data - ADMIN only
   */
  router.get('/:id', async (req: Request, res: Response, next) => {
    try {
      const { id } = req.params as { id: string }
      const price = await priceRepository.findById(id)

      if (!price) {
        return res.status(404).json({
          success: false,
          error: 'Price list not found',
        })
      }

      return res.json({
        success: true,
        data: {
          id: price.id,
          name: price.name,
          description: price.description,
          category: price.category,
          items: price.items,
          isActive: price.isActive,
          createdAt: price.createdAt,
          updatedAt: price.updatedAt,
        },
      })
    } catch (error) {
      return next(error)
    }
  })

  /**
   * GET /api/prices/:category
   * Get price list by category
   */
  router.get('/:category', async (req: Request, res: Response, next) => {
    try {
      const { category } = req.params as { category: string }
      await priceService.loadCurrentPrice()
      const price = priceService.getCurrentPrice()

      if (!price || price.category !== category) {
        return res.status(404).json({
          success: false,
          error: 'Price list not found',
        })
      }

      return res.json({
        success: true,
        data: price.items,
      })
    } catch (error) {
      return next(error)
    }
  })

  /**
   * POST /api/prices
   * Create new price list - ADMIN only
   */
  router.post('/', async (req: Request, res: Response, next) => {
    try {
      const { name, description, category, items, isActive } = req.body

      const price = new Price({
        name,
        description,
        category: category || 'rack',
        items: items || [],
        isActive: isActive ?? false,
      })

      const created = await priceRepository.create(price)

      res.status(201).json({
        success: true,
        data: {
          id: created.id,
          name: created.name,
          category: created.category,
          isActive: created.isActive,
        },
      })
    } catch (error) {
      next(error)
    }
  })

  /**
   * PUT /api/prices/:id
   * Update price list - ADMIN only
   */
  router.put('/:id', async (req: Request, res: Response, next) => {
    try {
      const { id } = req.params as { id: string }
      const { name, description, items, isActive } = req.body

      const price = await priceRepository.findById(id)
      if (!price) {
        return res.status(404).json({
          success: false,
          error: 'Price list not found',
        })
      }

      if (name !== undefined) price.name = name
      if (description !== undefined) price.description = description

      // Сортуємо items перед збереженням
      if (items && Array.isArray(items)) {
        price.items = sortPriceItems(items as any[])
      }

      if (isActive !== undefined) price.isActive = isActive

      const updated = await priceRepository.update(price)

      return res.json({
        success: true,
        data: {
          id: updated.id,
          name: updated.name,
          category: updated.category,
          isActive: updated.isActive,
        },
      })
    } catch (error) {
      return next(error)
    }
  })

  /**
   * Сортування елементів прайсу
   */
  function sortPriceItems(items: any[]): any[] {
    const typeOrder: Record<string, number> = {
      support: 1,
      span: 2,
      vertical_support: 3,
      diagonal_brace: 4,
      isolator: 5,
    }

    return items.sort((a, b) => {
      // Спочатку за типом
      const typeDiff = (typeOrder[a.type] || 99) - (typeOrder[b.type] || 99)
      if (typeDiff !== 0) return typeDiff

      // Потім за розміром
      const aNum = parseFloat(a.size || '0')
      const bNum = parseFloat(b.size || '0')

      if (!isNaN(aNum) && !isNaN(bNum)) {
        return aNum - bNum
      }

      // Якщо не числа, сортуємо як рядки
      return (a.size || '').localeCompare(b.size || '')
    })
  }

  /**
   * PUT /api/prices/bulk
   * Bulk update prices - ADMIN only
   */
  router.put('/bulk', async (req: Request, res: Response, next) => {
    try {
      console.log('[PUT /api/prices/bulk] Request body:', req.body)
      const { priceId, items } = req.body

      if (!priceId) {
        return res.status(400).json({
          success: false,
          error: 'priceId is required',
        })
      }

      if (!items || !Array.isArray(items)) {
        return res.status(400).json({
          success: false,
          error: 'items array is required',
        })
      }

      console.log('[PUT /api/prices/bulk] Calling useCase with:', {
        priceId,
        itemsCount: items.length,
      })

      const useCase = new BulkUpdatePricesUseCase(priceRepository)
      const result = await useCase.execute({ priceId, items })

      console.log('[PUT /api/prices/bulk] Result:', result)

      return res.json({
        success: true,
        data: result,
      })
    } catch (error) {
      console.error('[PUT /api/prices/bulk] Error:', error)
      return next(error)
    }
  })

  /**
   * POST /api/prices/:id/activate
   * Activate price list - ADMIN only
   */
  router.post('/:id/activate', async (req: Request, res: Response, next) => {
    try {
      const { id } = req.params as { id: string }
      const price = await priceRepository.activate(id)

      res.json({
        success: true,
        data: {
          id: price.id,
          isActive: price.isActive,
        },
      })
    } catch (error) {
      next(error)
    }
  })

  /**
   * POST /api/prices/:id/deactivate
   * Deactivate price list - ADMIN only
   */
  router.post('/:id/deactivate', async (req: Request, res: Response, next) => {
    try {
      const { id } = req.params as { id: string }
      const price = await priceRepository.deactivate(id)

      res.json({
        success: true,
        data: {
          id: price.id,
          isActive: price.isActive,
        },
      })
    } catch (error) {
      next(error)
    }
  })

  /**
   * DELETE /api/prices/:id
   * Delete price list - ADMIN only
   */
  router.delete('/:id', async (req: Request, res: Response, next) => {
    try {
      const { id } = req.params as { id: string }
      await priceRepository.delete(id)

      res.json({
        success: true,
      })
    } catch (error) {
      next(error)
    }
  })

  /**
   * GET /api/prices/rack/options
   * Get available options for rack calculator (supports, spans, vertical supports)
   */
  router.get('/rack/options', async (_req: Request, res: Response, next) => {
    try {
      await priceService.loadCurrentPrice()
      const price = priceService.getCurrentPrice()

      if (!price) {
        return res.status(404).json({
          success: false,
          error: 'Price list not found',
        })
      }

      // Extract available options from items
      const supports = price.items
        .filter((item) => item.type === 'support')
        .map((item) => ({
          value: item.size,
          label: item.size,
          stepped: item.size?.toUpperCase().includes('C') || false,
        }))

      const spans = price.items
        .filter((item) => item.type === 'span')
        .map((item) => ({
          value: item.size,
          label: item.size,
          length: parseInt(item.size || '0', 10),
        }))

      const verticalStands = price.items
        .filter((item) => item.type === 'vertical_support')
        .map((item) => ({
          value: item.size,
          label: item.size,
        }))

      return res.json({
        success: true,
        data: {
          supports,
          spans,
          verticalStands,
        },
      })
    } catch (error) {
      return next(error)
    }
  })

  /**
   * GET /api/prices/:id/export
   * Export prices to Excel - ADMIN only
   */
  router.get('/:id/export', async (req: Request, res: Response, next) => {
    try {
      const { id } = req.params as { id: string }

      const price = await priceRepository.findById(id)
      if (!price) {
        return res.status(404).json({
          success: false,
          error: 'Price not found',
        })
      }

      // Використовуємо стратегію для експорту
      const buffer = priceProcessor.exportToExcel(price.category, price.items)

      const filename = `price_${price.category}_${id}.xlsx`

      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      )
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)

      res.send(buffer)
    } catch (error) {
      return next(error)
    }
  })

  /**
   * POST /api/prices/:id/import
   * Import prices from Excel - ADMIN only
   */
  router.post('/:id/import', upload.single('file'), async (req: Request, res: Response, next) => {
    try {
      const { id } = req.params as { id: string }
      const file = req.file

      if (!file) {
        return res.status(400).json({
          success: false,
          error: 'No file uploaded',
        })
      }

      // Parse Excel file
      const workbook = XLSX.read(file.buffer, { type: 'buffer' })
      const worksheet = workbook.Sheets[workbook.SheetNames[0]]
      const rows: any[] = XLSX.utils.sheet_to_json(worksheet)

      // Отримати прайс
      const price = await priceRepository.findById(id)
      if (!price) {
        return res.status(404).json({
          success: false,
          error: 'Price not found',
        })
      }

      // Використовуємо стратегію для імпорту
      const result = priceProcessor.importFromExcel(price.category, rows)

      // Валідація
      if (!priceProcessor.validateItems(price.category, result.items)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid data format',
        })
      }

      // Оновити прайс
      price.items = result.items
      await priceRepository.update(price)

      res.json({
        success: true,
        data: result,
      })
    } catch (error) {
      return next(error)
    }
  })

  return router
}
