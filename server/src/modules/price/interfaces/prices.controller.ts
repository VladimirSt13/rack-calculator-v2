import { Router, Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { PriceRepository } from '../infrastructure/price.repository'
import { PriceService } from '../infrastructure/price.service'
import type { Price } from '../domain/entities/price.entity'

/**
 * Отримати доступні типи компонентів з прайсу
 */
export const createPricesRouter = () => {
  const router = Router()
  const prisma = new PrismaClient()
  const priceRepository = new PriceRepository(prisma)
  const priceService = new PriceService(priceRepository)

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
        data: price.data,
      })
    } catch (error) {
      return next(error)
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

      // Витяг доступних опцій з даних прайсу
      // supports structure: { "215": { edge: PriceComponent, intermediate: PriceComponent } }
      const supports = Object.keys(price.data.supports || {}).map((key) => {
        const code = key.split(' ')[0] // e.g., "430 кр" -> "430"
        return {
          value: code,
          label: code, // Тільки код для дропдауна
          stepped: code.toUpperCase().includes('C'),
        }
      })

      const spans = Object.keys(price.data.spans || {}).map((key) => {
        const span = price.data.spans[key]
        return {
          value: span.code || key,
          label: span.code || key, // Тільки довжина для дропдауна
          length: parseInt(span.code || key, 10),
        }
      })

      const verticalStands = Object.keys(price.data.vertical_supports || {}).map((key) => {
        const stand = price.data.vertical_supports[key]
        return {
          value: stand.code || key,
          label: stand.code || key, // Тільки код для дропдауна
        }
      })

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

  return router
}
