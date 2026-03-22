import { Request, Response, NextFunction } from 'express'
import { AuditRepository } from './AuditRepository.js'
import { prisma } from '../../../db/prisma.client.js'
import { AuthRequest } from '../../auth/interfaces/auth.middleware.js'

export interface AuditLogOptions {
  action: string
  resource: string
  getResourceId?: (req: Request, res: Response) => string | undefined
  getMessage?: (req: Request, res: Response) => string
  metadata?: (req: Request, res: Response) => Record<string, unknown>
}

export function createAuditMiddleware(options: AuditLogOptions) {
  const auditRepository = new AuditRepository(prisma)

  return async (req: Request, res: Response, next: NextFunction) => {
    // Log after response is sent
    const originalJson = res.json.bind(res)

    res.json = (body: unknown) => {
      // Log asynchronously (don't wait)
      setImmediate(async () => {
        try {
          const authReq = req as AuthRequest
          const userId = authReq.user?.userId as string | undefined
          const resourceId = options.getResourceId?.(req, res)
          const message = options.getMessage?.(req, res)
          const metadata = options.metadata?.(req, res)

          await auditRepository.create({
            action: options.action,
            resource: options.resource,
            resourceId,
            userId,
            message,
            metadata: {
              ...metadata,
              method: req.method,
              path: req.path,
              query: req.query,
              params: req.params,
              body: req.body,
              responseBody: body,
            },
            ipAddress: req.ip,
            userAgent: req.get('user-agent'),
            status: res.statusCode >= 400 ? 'FAILURE' : 'SUCCESS',
          })
        } catch (error) {
          console.error('Audit middleware error:', error)
          // Don't throw - logging should not break the app
        }
      })

      return originalJson(body)
    }

    next()
  }
}

// Helper to log auth events manually
export async function logAuthEvent(
  action: string,
  data: {
    userId?: string
    email?: string
    status?: 'SUCCESS' | 'FAILURE' | 'ERROR'
    message?: string
    metadata?: Record<string, unknown>
    ipAddress?: string
    userAgent?: string
  }
) {
  const auditRepository = new AuditRepository(prisma)

  try {
    await auditRepository.create({
      action,
      resource: 'auth',
      userId: data.userId,
      status: data.status ?? 'SUCCESS',
      message: data.message,
      metadata: {
        ...data.metadata,
        email: data.email,
      },
      ipAddress: data.ipAddress,
      userAgent: data.userAgent,
    })
  } catch (error) {
    console.error('logAuthEvent error:', error)
  }
}
