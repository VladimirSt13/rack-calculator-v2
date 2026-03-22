import { Router, Request, Response } from 'express'
import { AuditRepository } from '../infrastructure/AuditRepository.js'
import { GetAuditLogsUseCase } from '../application/use-cases/auditUseCases.js'
import { prisma } from '../../../db/prisma.client.js'
import { authMiddleware } from '../../auth/interfaces/auth.middleware.js'
import { requireRole } from '../../roles/infrastructure/middlewares/requireRole.js'
import { AuthRequest } from '../../auth/interfaces/auth.middleware.js'

export class AuditController {
  private router: Router
  private auditRepository: AuditRepository
  private getAuditLogsUseCase: GetAuditLogsUseCase

  constructor() {
    this.auditRepository = new AuditRepository(prisma)
    this.getAuditLogsUseCase = new GetAuditLogsUseCase(this.auditRepository)
    this.router = Router()
    this.initializeRoutes()
  }

  private initializeRoutes() {
    // Get all audit logs (admin only)
    this.router.get('/', authMiddleware, requireRole('ADMIN'), this.getLogs.bind(this))

    // Get audit logs by user (own logs)
    this.router.get('/my', authMiddleware, this.getMyLogs.bind(this))

    // Get single audit log by ID
    this.router.get('/:id', authMiddleware, requireRole('ADMIN'), this.getLogById.bind(this))
  }

  private async getLogs(req: Request, res: Response) {
    try {
      const { action, resource, status, startDate, endDate, limit = '50', skip = '0' } = req.query

      const filters = {
        action: action as string,
        resource: resource as string,
        status: status as 'SUCCESS' | 'FAILURE' | 'ERROR',
        startDate: startDate ? new Date(startDate as string) : undefined,
        endDate: endDate ? new Date(endDate as string) : undefined,
        limit: parseInt(limit as string, 10),
        skip: parseInt(skip as string, 10),
      }

      const [logs, total] = await Promise.all([
        this.getAuditLogsUseCase.execute(filters),
        this.auditRepository.count(filters),
      ])

      res.json({
        success: true,
        data: {
          logs,
          pagination: {
            total,
            limit: filters.limit,
            skip: filters.skip,
          },
        },
      })
    } catch (error) {
      console.error('AuditController - getLogs error:', error)
      res.status(500).json({
        success: false,
        error: {
          code: 'AUDIT_LOGS_FETCH_ERROR',
          message: 'Failed to fetch audit logs',
        },
      })
    }
  }

  private async getMyLogs(req: Request, res: Response): Promise<void> {
    try {
      const authReq = req as AuthRequest
      const userId = authReq.user?.userId as string | undefined

      if (!userId) {
        res.status(401).json({
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'User not authenticated',
          },
        })
        return
      }

      const { limit = '50', skip = '0' } = req.query

      const logs = await this.getAuditLogsUseCase.execute({
        userId,
        limit: parseInt(limit as string, 10),
        skip: parseInt(skip as string, 10),
      })

      res.json({
        success: true,
        data: logs,
      })
    } catch (error) {
      console.error('AuditController - getMyLogs error:', error)
      res.status(500).json({
        success: false,
        error: {
          code: 'AUDIT_LOGS_FETCH_ERROR',
          message: 'Failed to fetch audit logs',
        },
      })
    }
  }

  private async getLogById(req: Request, res: Response): Promise<void> {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id

      const log = await this.auditRepository.findById(id)

      if (!log) {
        res.status(404).json({
          success: false,
          error: {
            code: 'AUDIT_LOG_NOT_FOUND',
            message: 'Audit log not found',
          },
        })
        return
      }

      res.json({
        success: true,
        data: log,
      })
    } catch (error) {
      console.error('AuditController - getLogById error:', error)
      res.status(500).json({
        success: false,
        error: {
          code: 'AUDIT_LOG_FETCH_ERROR',
          message: 'Failed to fetch audit log',
        },
      })
    }
  }

  public getRouter(): Router {
    return this.router
  }
}
