import { Router, Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { RackRepository } from '../infrastructure/rack.repository'
import { PriceService } from '../../price/infrastructure/price.service'
import { PriceRepository } from '../../price/infrastructure/price.repository'
import { CalculateRackUseCase } from '../application/use-cases/calculateRack.use-case'
import type { AuthRequest } from '../../common/middleware/rbac.middleware'
import { authMiddleware } from '../../auth/interfaces/auth.middleware'
import { requirePermission } from '../../common/middleware/rbac.middleware'

/**
 * Rack Controller
 */
export class RackController {
  private router: Router
  private calculateUseCase: CalculateRackUseCase
  private rackRepository: RackRepository

  constructor() {
    this.router = Router()

    const prisma = new PrismaClient()
    const rackRepository = new RackRepository(prisma)
    const priceRepository = new PriceRepository(prisma)
    const priceService = new PriceService(priceRepository)

    this.rackRepository = rackRepository
    this.calculateUseCase = new CalculateRackUseCase(rackRepository, priceService)

    this.initRoutes()
  }

  private initRoutes(): void {
    /**
     * POST /api/rack/calculate
     * Расчёт стеллажа
     */
    this.router.post('/calculate', async (req: Request, res: Response, next) => {
      try {
        const input = req.body
        const authReq = req as AuthRequest
        const userId = authReq.user?.userId

        const result = await this.calculateUseCase.execute(input, userId)

        return res.json({
          success: true,
          data: result,
        })
      } catch (error) {
        return next(error)
      }
    })

    /**
     * GET /api/rack/my
     * Получение списка стеллажей пользователя
     */
    this.router.get('/my', authMiddleware, async (req: AuthRequest, res: Response, next) => {
      try {
        const userId = req.user!.userId
        const take = parseInt(req.query.limit as string, 10) || 50
        const skip = parseInt(req.query.skip as string, 10) || 0

        const racks = await this.rackRepository.findByUserId(userId, take, skip)

        return res.json({
          success: true,
          data: racks,
        })
      } catch (error) {
        return next(error)
      }
    })

    /**
     * GET /api/rack/:id
     * Получение деталей стеллажа по ID
     */
    this.router.get('/:id', authMiddleware, async (req: AuthRequest, res: Response, next) => {
      try {
        const { id } = req.params

        const rack = await this.rackRepository.findById(id as string)

        if (!rack) {
          return res.status(404).json({
            success: false,
            error: 'Rack not found',
          })
        }

        return res.json({
          success: true,
          data: rack,
        })
      } catch (error) {
        return next(error)
      }
    })

    /**
     * DELETE /api/rack/:id
     * Удаление стеллажа (soft delete)
     */
    this.router.delete(
      '/:id',
      authMiddleware,
      requirePermission('rack', 'delete'),
      async (req: AuthRequest, res: Response, next) => {
        try {
          const { id } = req.params
          const userId = req.user!.userId

          const deleted = await this.rackRepository.delete(id as string, userId)

          if (!deleted) {
            return res.status(404).json({
              success: false,
              error: 'Rack not found or access denied',
            })
          }

          return res.json({
            success: true,
            message: 'Rack deleted successfully',
          })
        } catch (error) {
          return next(error)
        }
      }
    )

    /**
     * POST /api/rack/:id/restore
     * Восстановление удалённого стеллажа
     */
    this.router.post(
      '/:id/restore',
      authMiddleware,
      requirePermission('rack', 'update'),
      async (req: AuthRequest, res: Response, next) => {
        try {
          const { id } = req.params
          const userId = req.user!.userId

          const restored = await this.rackRepository.restore(id as string, userId)

          if (!restored) {
            return res.status(404).json({
              success: false,
              error: 'Rack not found or access denied',
            })
          }

          return res.json({
            success: true,
            message: 'Rack restored successfully',
          })
        } catch (error) {
          return next(error)
        }
      }
    )

    /**
     * GET /api/rack/:id/revisions
     * Получение ревизий стеллажа
     */
    this.router.get(
      '/:id/revisions',
      authMiddleware,
      async (req: AuthRequest, res: Response, next) => {
        try {
          const { id } = req.params
          const limit = parseInt(req.query.limit as string, 10) || 10

          const revisions = await this.rackRepository.getRevisions(id as string, limit)

          return res.json({
            success: true,
            data: revisions,
          })
        } catch (error) {
          return next(error)
        }
      }
    )
  }

  getRouter(): Router {
    return this.router
  }
}

/**
 * Factory function для создания router
 */
export const createRackRouter = (): Router => {
  const controller = new RackController()
  return controller.getRouter()
}
