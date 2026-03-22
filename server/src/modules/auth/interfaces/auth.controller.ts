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
   * Обновление access токена
   */
  router.post('/refresh', async (req: Request, res: Response, next) => {
    try {
      const { refreshToken } = req.body

      if (!refreshToken) {
        throw AppError.badRequest('Refresh token required', 'REFRESH_TOKEN_REQUIRED')
      }

      // Верификация refresh токена
      const payload = JwtService.verifyRefreshToken(refreshToken)

      // Поиск пользователя
      const user = await userRepository.findById(payload.userId)
      if (!user) {
        throw AppError.unauthorized('User not found', 'USER_NOT_FOUND')
      }

      // Проверка совпадения refresh токена
      if (user.refreshToken !== refreshToken) {
        throw AppError.unauthorized('Invalid refresh token', 'INVALID_REFRESH_TOKEN')
      }

      // Генерация новых токенов
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

      // Сохранение нового refresh токена
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
   * Получение текущего пользователя
   */
  router.get('/me', authMiddleware, async (req: AuthRequest, res: Response, next) => {
    try {
      const userId = req.user!.userId
      const userRoleId = req.user!.roleId

      const user = await userRepository.findById(userId)
      if (!user) {
        throw AppError.notFound('User not found', 'USER_NOT_FOUND')
      }

      // Если roleId есть в токене, но нет в БД — обновить пользователя
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
          role: req.user!.role, // Берём роль из токена
          roleId: req.user!.roleId, // Добавляем roleId
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
   * Вход в систему
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
   * Запрос на сброс пароля
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
   * Подтверждение сброса пароля
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
   * Повторная отправка verification email
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
