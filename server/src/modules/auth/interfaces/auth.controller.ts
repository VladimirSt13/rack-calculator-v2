import { Router, Request, Response } from 'express'
import { prisma } from '../../../db/prisma.client.js'
import { UserRepository } from '../../users/infrastructure/user.repository.js'
import { RegisterUserUseCase } from '../application/register-user.use-case.js'
import { LoginUserUseCase } from '../application/login-user.use-case.js'
import {
  RequestResetPasswordUseCase,
  ResetPasswordUseCase,
} from '../application/reset-password.use-case.js'
import { SendVerificationEmailUseCase } from '../application/verify-email.use-case.js'
import { AppError } from '../../common/errors/app.error.js'
import { JwtService } from '../infrastructure/jwt.service.js'
import { authMiddleware, AuthRequest } from './auth.middleware.js'

export const createAuthRouter = () => {
  const router = Router()
  const userRepository = new UserRepository(prisma)

  /**
   * POST /api/auth/refresh
   * Оновлення access токена
   */
  router.post('/refresh', async (req: Request, res: Response, next) => {
    try {
      const { refreshToken } = req.body

      if (!refreshToken) {
        throw AppError.badRequest('Refresh token required', 'REFRESH_TOKEN_REQUIRED')
      }

      // Верифікація refresh токена
      const payload = JwtService.verifyRefreshToken(refreshToken)

      // Пошук користувача
      const user = await userRepository.findById(payload.userId)
      if (!user) {
        throw AppError.unauthorized('User not found', 'USER_NOT_FOUND')
      }

      // Перевірка збігу refresh токена
      if (user.refreshToken !== refreshToken) {
        throw AppError.unauthorized('Invalid refresh token', 'INVALID_REFRESH_TOKEN')
      }

      // Генерація нових токенів
      const tokens = {
        accessToken: JwtService.generateAccessToken({
          userId: user.id,
          email: user.email.toString(),
          role: user.role || 'USER',
          roleId: user.roleId,
        }),
        refreshToken: JwtService.generateRefreshToken({
          userId: user.id,
          email: user.email.toString(),
          role: user.role || 'USER',
          roleId: user.roleId,
        }),
      }

      // Збереження нового refresh токена
      user.setRefreshToken(tokens.refreshToken)
      await userRepository.update(user)

      res.json({
        success: true,
        data: { tokens },
      })
    } catch (error) {
      next(error)
    }
  })

  /**
   * POST /api/auth/logout
   * Выход из системы
   */
  router.post('/logout', authMiddleware, async (req: AuthRequest, res: Response, next) => {
    try {
      const userId = req.user!.userId

      const user = await userRepository.findById(userId)
      if (!user) {
        throw AppError.notFound('User not found', 'USER_NOT_FOUND')
      }

      user.setRefreshToken(null)
      await userRepository.update(user)

      res.json({
        success: true,
        message: 'Logged out successfully',
      })
    } catch (error) {
      next(error)
    }
  })

  /**
   * GET /api/auth/me
   * Отримання поточного користувача
   */
  router.get('/me', authMiddleware, async (req: AuthRequest, res: Response, next) => {
    try {
      const userId = req.user!.userId
      const userRoleId = req.user!.roleId

      const user = await userRepository.findById(userId)
      if (!user) {
        throw AppError.notFound('User not found', 'USER_NOT_FOUND')
      }

      // Якщо roleId є в токені, але немає в БД — оновити користувача
      if (userRoleId && !user.roleId) {
        user.setRoleId(userRoleId)
        await userRepository.update(user)
      }

      res.json({
        success: true,
        data: {
          id: user.id,
          email: user.email.toString(),
          firstName: user.firstName,
          lastName: user.lastName,
          role: req.user!.role, // Беремо роль з токена
          roleId: req.user!.roleId, // Додаємо roleId
          emailVerified: user.emailVerified,
          createdAt: user.createdAt,
        },
      })
    } catch (error) {
      next(error)
    }
  })

  /**
   * POST /api/auth/register
   * Регистрация нового пользователя
   */
  router.post('/register', async (req: Request, res: Response, next) => {
    try {
      const { email, password, firstName, lastName } = req.body

      const useCase = new RegisterUserUseCase(userRepository)
      const result = await useCase.execute({ email, password, firstName, lastName })

      res.status(201).json({
        success: true,
        data: {
          user: {
            id: result.user.id,
            email: result.user.email.toString(),
            firstName: result.user.firstName,
            lastName: result.user.lastName,
            role: result.user.role,
          },
          tokens: result.tokens,
        },
      })
    } catch (error) {
      next(error)
    }
  })

  /**
   * POST /api/auth/login
   * Вхід до системи
   */
  router.post('/login', async (req: Request, res: Response, next) => {
    try {
      const { email, password } = req.body

      const useCase = new LoginUserUseCase(userRepository)
      const result = await useCase.execute({
        email,
        password,
        ipAddress: req.ip,
        userAgent: req.get('user-agent'),
      })

      res.json({
        success: true,
        data: {
          user: {
            id: result.user.id,
            email: result.user.email.toString(),
            firstName: result.user.firstName,
            lastName: result.user.lastName,
            role: result.user.role,
          },
          tokens: result.tokens,
        },
      })
    } catch (error) {
      next(error)
    }
  })

  /**
   * POST /api/auth/reset-password/request
   * Запит на скидання пароля
   */
  router.post('/reset-password/request', async (req: Request, res: Response, next) => {
    try {
      const { email } = req.body

      const useCase = new RequestResetPasswordUseCase(userRepository)
      const result = await useCase.execute({ email })

      res.json({
        success: true,
        message: result.message,
      })
    } catch (error) {
      next(error)
    }
  })

  /**
   * POST /api/auth/reset-password/confirm
   * Підтвердження скидання пароля
   */
  router.post('/reset-password/confirm', async (req: Request, res: Response, next) => {
    try {
      const { token, newPassword, userId } = req.body

      if (!userId) {
        throw AppError.badRequest('userId is required', 'USER_ID_REQUIRED')
      }

      const useCase = new ResetPasswordUseCase(userRepository)
      await useCase.execute({ token, userId, newPassword })

      res.json({
        success: true,
        message: 'Password has been reset successfully',
      })
    } catch (error) {
      next(error)
    }
  })

  /**
   * POST /api/auth/resend-verification
   * Повторна відправка verification email
   */
  router.post('/resend-verification', async (req: Request, res: Response, next) => {
    try {
      const { email } = req.body

      if (!email) {
        throw AppError.badRequest('Email is required', 'EMAIL_REQUIRED')
      }

      const useCase = new SendVerificationEmailUseCase(userRepository)
      const result = await useCase.execute(email)

      res.json({
        success: true,
        message: result.message,
      })
    } catch (error) {
      next(error)
    }
  })

  return router
}
