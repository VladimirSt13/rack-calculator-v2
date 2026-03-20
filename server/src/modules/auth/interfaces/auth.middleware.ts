import { Request, Response, NextFunction } from 'express'
import { JwtService, TokenPayload } from '../infrastructure/jwt.service.js'
import { AppError } from '../../common/errors/app.error.js'

export interface AuthRequest extends Request {
  user?: TokenPayload
}

export const authMiddleware = (req: AuthRequest, _res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw AppError.unauthorized('No token provided', 'NO_TOKEN')
    }

    const token = authHeader.substring(7)
    const payload = JwtService.verifyAccessToken(token)

    req.user = payload
    next()
  } catch (error) {
    if (error instanceof AppError) {
      return next(error)
    }
    next(AppError.unauthorized('Invalid token', 'INVALID_TOKEN'))
  }
}

export const optionalAuthMiddleware = (req: AuthRequest, _res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next()
    }

    const token = authHeader.substring(7)
    const payload = JwtService.verifyAccessToken(token)

    req.user = payload
    next()
  } catch {
    // Токен недействителен, но это не ошибка для опциональной аутентификации
    next()
  }
}
