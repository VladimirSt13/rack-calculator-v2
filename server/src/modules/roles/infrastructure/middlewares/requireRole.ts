import { Request, Response, NextFunction } from 'express'
import { AuthRequest } from '../../../auth/interfaces/auth.middleware.js'
import { prisma } from '../../../../db/prisma.client.js'

export function requireRole(...allowedRoles: string[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authReq = req as AuthRequest
      const roleId = authReq.user?.roleId

      if (!roleId) {
        res.status(403).json({
          success: false,
          error: {
            code: 'ROLE_REQUIRED',
            message: 'Role required',
          },
        })
        return
      }

      // Поиск роли
      const role = await prisma.role.findUnique({
        where: { id: roleId },
      })

      if (!role) {
        res.status(403).json({
          success: false,
          error: {
            code: 'ROLE_NOT_FOUND',
            message: 'Role not found',
          },
        })
        return
      }

      // Проверка роли
      if (!allowedRoles.includes(role.name)) {
        res.status(403).json({
          success: false,
          error: {
            code: 'INSUFFICIENT_ROLE',
            message: `Required roles: ${allowedRoles.join(', ')}`,
          },
        })
        return
      }

      next()
    } catch (error) {
      console.error('requireRole error:', error)
      res.status(500).json({
        success: false,
        error: {
          code: 'ROLE_CHECK_ERROR',
          message: 'Failed to check role',
        },
      })
    }
  }
}
