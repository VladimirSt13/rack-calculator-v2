import { Router, Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { PermissionRepository } from '../infrastructure/permission.repository.js'
import { Permission } from '../domain/entities/permission.entity.js'

export const createPermissionsRouter = () => {
  const router = Router()
  const prisma = new PrismaClient()
  const permissionRepository = new PermissionRepository(prisma)

  /**
   * GET /api/permissions
   * Get all permissions
   */
  router.get('/', async (_req: Request, res: Response, next) => {
    try {
      const permissions = await permissionRepository.findAll()
      return res.json({
        success: true,
        data: permissions,
      })
    } catch (_error) {
      return next(_error)
    }
  })

  /**
   * GET /api/permissions/:id
   * Get permission by ID
   */
  router.get('/:id', async (req: Request, res: Response, next) => {
    try {
      const permission = await permissionRepository.findById(req.params.id as string)
      if (!permission) {
        return res.status(404).json({
          success: false,
          error: 'Permission not found',
        })
      }

      return res.json({
        success: true,
        data: permission,
      })
    } catch (_error) {
      return next(_error)
    }
  })

  /**
   * GET /api/permissions/resource/:resource
   * Get permissions by resource
   */
  router.get('/resource/:resource', async (req: Request, res: Response, next) => {
    try {
      const permissions = await permissionRepository.findByResource(req.params.resource as string)
      return res.json({
        success: true,
        data: permissions,
      })
    } catch (_error) {
      return next(_error)
    }
  })

  /**
   * POST /api/permissions
   * Create a new permission
   */
  router.post('/', async (req: Request, res: Response, next) => {
    try {
      const { name, resource, action } = req.body

      const existingPermission = await permissionRepository.findByName(name)
      if (existingPermission) {
        return res.status(400).json({
          success: false,
          error: 'Permission with this name already exists',
        })
      }

      const permission = new Permission({ name, resource, action })
      const created = await permissionRepository.create(permission)

      return res.status(201).json({
        success: true,
        data: created,
      })
    } catch (_error) {
      return next(_error)
    }
  })

  /**
   * PUT /api/permissions/:id
   * Update a permission
   */
  router.put('/:id', async (req: Request, res: Response, next) => {
    try {
      const permission = await permissionRepository.findById(req.params.id as string)
      if (!permission) {
        return res.status(404).json({
          success: false,
          error: 'Permission not found',
        })
      }

      const { name, resource, action } = req.body
      permission.update(name, resource, action)
      const updated = await permissionRepository.update(permission)

      return res.json({
        success: true,
        data: updated,
      })
    } catch (_error) {
      return next(_error)
    }
  })

  /**
   * DELETE /api/permissions/:id
   * Delete a permission
   */
  router.delete('/:id', async (req: Request, res: Response, next) => {
    try {
      await permissionRepository.delete(req.params.id as string)

      return res.json({
        success: true,
        message: 'Permission deleted successfully',
      })
    } catch (_error) {
      return next(_error)
    }
  })

  return router
}
