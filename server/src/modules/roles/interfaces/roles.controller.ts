import { Router, Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { RoleRepository } from '../infrastructure/role.repository.js'
import { Role } from '../domain/entities/role.entity.js'

export const createRolesRouter = () => {
  const router = Router()
  const prisma = new PrismaClient()
  const roleRepository = new RoleRepository(prisma)

  /**
   * GET /api/roles
   * Get all roles
   */
  router.get('/', async (_req: Request, res: Response, next) => {
    try {
      const roles = await roleRepository.findAll()
      return res.json({
        success: true,
        data: roles,
      })
    } catch (_error) {
      return next(_error)
    }
  })

  /**
   * GET /api/roles/:id
   * Get role by ID
   */
  router.get('/:id', async (req: Request, res: Response, next) => {
    try {
      const role = await roleRepository.findById(req.params.id as string)
      if (!role) {
        return res.status(404).json({
          success: false,
          error: 'Role not found',
        })
      }

      return res.json({
        success: true,
        data: role,
      })
    } catch (_error) {
      return next(_error)
    }
  })

  /**
   * POST /api/roles
   * Create a new role
   */
  router.post('/', async (req: Request, res: Response, next) => {
    try {
      const { name, description, permissionIds } = req.body

      const existingRole = await roleRepository.findByName(name)
      if (existingRole) {
        return res.status(400).json({
          success: false,
          error: 'Role with this name already exists',
        })
      }

      const role = new Role({ name, description, permissionIds })
      const created = await roleRepository.create(role)

      return res.status(201).json({
        success: true,
        data: created,
      })
    } catch (_error) {
      return next(_error)
    }
  })

  /**
   * PUT /api/roles/:id
   * Update a role
   */
  router.put('/:id', async (req: Request, res: Response, next) => {
    try {
      const role = await roleRepository.findById(req.params.id as string)
      if (!role) {
        return res.status(404).json({
          success: false,
          error: 'Role not found',
        })
      }

      const { name, description } = req.body
      role.update(name, description)
      const updated = await roleRepository.update(role)

      return res.json({
        success: true,
        data: updated,
      })
    } catch (_error) {
      return next(_error)
    }
  })

  /**
   * POST /api/roles/:id/permissions
   * Add permissions to a role
   */
  router.post('/:id/permissions', async (req: Request, res: Response, next) => {
    try {
      const { permissionIds } = req.body
      if (!Array.isArray(permissionIds) || permissionIds.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'permissionIds must be a non-empty array',
        })
      }

      const role = await roleRepository.addPermissions(req.params.id as string, permissionIds)

      return res.json({
        success: true,
        data: role,
      })
    } catch (_error) {
      return next(_error)
    }
  })

  /**
   * DELETE /api/roles/:id/permissions
   * Remove permissions from a role
   */
  router.delete('/:id/permissions', async (req: Request, res: Response, next) => {
    try {
      const { permissionIds } = req.body
      if (!Array.isArray(permissionIds) || permissionIds.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'permissionIds must be a non-empty array',
        })
      }

      const role = await roleRepository.removePermissions(req.params.id as string, permissionIds)

      return res.json({
        success: true,
        data: role,
      })
    } catch (_error) {
      return next(_error)
    }
  })

  /**
   * DELETE /api/roles/:id
   * Delete a role
   */
  router.delete('/:id', async (req: Request, res: Response, next) => {
    try {
      await roleRepository.delete(req.params.id as string)

      return res.json({
        success: true,
        message: 'Role deleted successfully',
      })
    } catch (_error) {
      return next(_error)
    }
  })

  return router
}
