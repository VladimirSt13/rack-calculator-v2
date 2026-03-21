import { Express } from 'express'
import { createAuthRouter } from './modules/auth/interfaces/auth.controller.js'
import { createRolesRouter } from './modules/roles/interfaces/roles.controller.js'
import { createPermissionsRouter } from './modules/permissions/interfaces/permissions.controller.js'
import { createPricesRouter } from './modules/price/interfaces/prices.controller.js'

export const registerRoutes = (app: Express) => {
  // Auth routes
  app.use('/api/auth', createAuthRouter())

  // RBAC routes
  app.use('/api/roles', createRolesRouter())
  app.use('/api/permissions', createPermissionsRouter())

  // Price routes
  app.use('/api/prices', createPricesRouter())

  // Placeholder для будущих модулей
  // app.use('/api/rack', createRackRouter())
  // app.use('/api/users', createUsersRouter())
}
