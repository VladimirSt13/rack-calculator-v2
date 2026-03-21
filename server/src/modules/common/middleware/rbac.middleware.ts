import { Request, Response, NextFunction } from 'express'
import { PrismaClient } from '@prisma/client'
import { RoleRepository } from '../../roles/infrastructure/role.repository.js'
import { PermissionRepository } from '../../permissions/infrastructure/permission.repository.js'
import { AppError } from '../errors/app.error.js'

export interface AuthRequest extends Request {
  user?: {
    userId: string
    email: string
    roleId?: string
  }
}

/**
 * Middleware factory for checking permissions
 * Usage: router.get('/users', requirePermission('users', 'read'), usersController)
 */
export const requirePermission = (resource: string, action: string) => {
  return async (req: AuthRequest, _res: Response, next: NextFunction) => {
    try {
      const prisma = new PrismaClient()
      const roleRepository = new RoleRepository(prisma)
      const permissionRepository = new PermissionRepository(prisma)

      const user = req.user
      if (!user) {
        throw AppError.unauthorized('User not authenticated')
      }

      if (!user.roleId) {
        throw AppError.forbidden('User has no role assigned')
      }

      // Find role
      const role = await roleRepository.findById(user.roleId)
      if (!role) {
        throw AppError.forbidden('Role not found')
      }

      // Find permissions for the resource
      const permissions = await permissionRepository.findByResource(resource)
      const matchingPermission = permissions.find((p: { action: string }) => p.action === action)

      if (!matchingPermission) {
        throw AppError.forbidden('Permission not found')
      }

      // Check if role has the permission
      const hasPermission = role.permissionIds.includes(matchingPermission.id)

      if (!hasPermission) {
        throw AppError.forbidden('Permission denied')
      }

      next()
    } catch (error) {
      next(error)
    }
  }
}

/**
 * Middleware factory for checking if user has ANY of the specified permissions
 */
export const requireAnyPermission = (permissions: { resource: string; action: string }[]) => {
  return async (req: AuthRequest, _res: Response, next: NextFunction) => {
    try {
      const prisma = new PrismaClient()
      const roleRepository = new RoleRepository(prisma)
      const permissionRepository = new PermissionRepository(prisma)

      const user = req.user
      if (!user) {
        throw AppError.unauthorized('User not authenticated')
      }

      if (!user.roleId) {
        throw AppError.forbidden('User has no role assigned')
      }

      const role = await roleRepository.findById(user.roleId)
      if (!role) {
        throw AppError.forbidden('Role not found')
      }

      // Check each permission
      let hasAnyPermission = false
      for (const perm of permissions) {
        const perms = await permissionRepository.findByResource(perm.resource)
        const matchingPermission = perms.find((p: { action: string }) => p.action === perm.action)

        if (matchingPermission && role.permissionIds.includes(matchingPermission.id)) {
          hasAnyPermission = true
          break
        }
      }

      if (!hasAnyPermission) {
        throw AppError.forbidden('Insufficient permissions')
      }

      next()
    } catch (error) {
      next(error)
    }
  }
}

/**
 * Middleware for checking if user has a specific role
 */
export const requireRole = (roleName: string) => {
  return async (req: AuthRequest, _res: Response, next: NextFunction) => {
    try {
      const prisma = new PrismaClient()
      const roleRepository = new RoleRepository(prisma)

      const user = req.user
      if (!user) {
        throw AppError.unauthorized('User not authenticated')
      }

      if (!user.roleId) {
        throw AppError.forbidden('User has no role assigned')
      }

      const role = await roleRepository.findById(user.roleId)
      if (!role) {
        throw AppError.forbidden('Role not found')
      }

      if (role.name !== roleName) {
        throw AppError.forbidden(`Requires ${roleName} role`)
      }

      next()
    } catch (error) {
      next(error)
    }
  }
}
