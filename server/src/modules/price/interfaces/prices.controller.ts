import { Router, Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { PriceRepository } from '../infrastructure/price.repository.js'
import { PriceService } from '../infrastructure/price.service.js'
import { Price } from '../domain/entities/price.entity.js'
import { authMiddleware } from '../../auth/interfaces/auth.middleware.js'
import { requirePermission } from '../../common/middleware/rbac.middleware.js'

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
        data: prices.map((p) => ({
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
   * Get price list by category (with prices visible based on role)
   */
  router.get('/:category', async (req: Request, res: Response, next) => {
    try {
      const { category } = req.params as { category: string }
      const price = await priceRepository.findActiveByCategory(category)

      if (!price) {
        return res.status(404).json({
          success: false,
          error: 'Price list not found',
        })
      }

      return res.json({
        success: true,
        data: price,
      })
    } catch (_error) {
      return next(_error)
    }
  })

  /**
   * POST /api/prices
   * Create new price list (admin only)
   */
  router.post(
    '/',
    authMiddleware,
    requirePermission('prices', 'create'),
    async (req: Request, res: Response, next) => {
      try {
        const { category, data, validFrom, validUntil } = req.body

        const exists = await priceRepository.existsByCategory(category)
        if (exists) {
          return res.status(400).json({
            success: false,
            error: 'Price list with this category already exists',
          })
        }

        const price = new Price({
          category,
          data,
          validFrom: validFrom ? new Date(validFrom) : undefined,
          validUntil: validUntil ? new Date(validUntil) : undefined,
          isActive: true,
        })

        const created = await priceRepository.create(price)

        return res.status(201).json({
          success: true,
          data: created,
        })
      } catch (_error) {
        return next(_error)
      }
    }
  )

  /**
   * PUT /api/prices/:id
   * Update price list (admin only)
   */
  router.put(
    '/:id',
    authMiddleware,
    requirePermission('prices', 'update'),
    async (req: Request, res: Response, next) => {
      try {
        const { id } = req.params as { id: string }
        const { data, validFrom, validUntil } = req.body

        const price = await priceRepository.findById(id)
        if (!price) {
          return res.status(404).json({
            success: false,
            error: 'Price list not found',
          })
        }

        if (data) {
          price.updateData(data)
        }
        if (validFrom) {
          price.validFrom = new Date(validFrom)
        }
        if (validUntil) {
          price.validUntil = new Date(validUntil)
        }

        const updated = await priceRepository.update(price)

        return res.json({
          success: true,
          data: updated,
        })
      } catch (_error) {
        return next(_error)
      }
    }
  )

  /**
   * POST /api/prices/:id/activate
   * Activate price list (admin only)
   */
  router.post(
    '/:id/activate',
    authMiddleware,
    requirePermission('prices', 'update'),
    async (req: Request, res: Response, next) => {
      try {
        const { id } = req.params as { id: string }
        await priceRepository.activate(id)

        return res.json({
          success: true,
          message: 'Price list activated',
        })
      } catch (_error) {
        return next(_error)
      }
    }
  )

  /**
   * POST /api/prices/:id/deactivate
   * Deactivate price list (admin only)
   */
  router.post(
    '/:id/deactivate',
    authMiddleware,
    requirePermission('prices', 'update'),
    async (req: Request, res: Response, next) => {
      try {
        const { id } = req.params as { id: string }
        await priceRepository.deactivate(id)

        return res.json({
          success: true,
          message: 'Price list deactivated',
        })
      } catch (_error) {
        return next(_error)
      }
    }
  )

  /**
   * DELETE /api/prices/:id
   * Delete price list (admin only)
   */
  router.delete(
    '/:id',
    authMiddleware,
    requirePermission('prices', 'delete'),
    async (req: Request, res: Response, next) => {
      try {
        const { id } = req.params as { id: string }
        await priceRepository.delete(id)

        return res.json({
          success: true,
          message: 'Price list deleted',
        })
      } catch (_error) {
        return next(_error)
      }
    }
  )

  return router
}
