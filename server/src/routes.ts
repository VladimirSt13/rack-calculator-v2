import { Express } from 'express'
import { createAuthRouter } from './modules/auth/interfaces/auth.controller.js'

export const registerRoutes = (app: Express) => {
  // Auth routes
  app.use('/api/auth', createAuthRouter())

  // Placeholder для будущих модулей
  // app.use('/api/rack', createRackRouter())
  // app.use('/api/users', createUsersRouter())
}
