import { UserRepository } from '../../users/infrastructure/user.repository.js'
import { Email } from '../../users/domain/value-objects/email.vo.js'
import { Password } from '../../users/domain/value-objects/password.vo.js'
import { User } from '../../users/domain/entities/user.entity.js'
import { AppError } from '../../common/errors/app.error.js'
import { JwtService, Tokens } from '../infrastructure/jwt.service.js'
import { logAuthEvent } from '../../audit/infrastructure/audit.middleware.js'
import { AuditActions } from '../../audit/domain/value-objects/AuditAction.js'
import { prisma } from '../../../db/prisma.client.js'

export interface LoginInput {
  email: string
  password: string
  ipAddress?: string
  userAgent?: string
}

export interface LoginOutput {
  user: User
  tokens: Tokens
}

export class LoginUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(input: LoginInput): Promise<LoginOutput> {
    const email = new Email(input.email)

    try {
      // Поиск пользователя
      const user = await this.userRepository.findByEmail(email)
      if (!user) {
        await this.logAuditEvent(
          input.email,
          'FAILURE',
          'User not found',
          input.ipAddress,
          input.userAgent
        )
        throw AppError.unauthorized('Invalid credentials', 'INVALID_CREDENTIALS')
      }

      // Загрузка роли из БД если есть roleId
      if (user.roleId) {
        const role = await prisma.role.findUnique({
          where: { id: user.roleId },
        })
        if (role) {
          user.role = role.name as 'USER' | 'ADMIN'
        }
      }

      // Проверка пароля
      const passwordValid = await Password.compare(input.password, user.passwordHash)
      if (!passwordValid) {
        await this.logAuditEvent(
          input.email,
          'FAILURE',
          'Invalid password',
          input.ipAddress,
          input.userAgent,
          user.id
        )
        throw AppError.unauthorized('Invalid credentials', 'INVALID_CREDENTIALS')
      }

      // Генерация токенов
      const tokens = this.generateTokens(user)

      // Сохранение refresh токена
      user.setRefreshToken(tokens.refreshToken)
      await this.userRepository.update(user)

      // Логирование успешного входа
      await this.logAuditEvent(
        input.email,
        'SUCCESS',
        undefined,
        input.ipAddress,
        input.userAgent,
        user.id
      )

      return {
        user,
        tokens,
      }
    } catch (error) {
      // Log error if not already logged
      if (!(error instanceof AppError)) {
        await this.logAuditEvent(
          input.email,
          'ERROR',
          (error as Error).message,
          input.ipAddress,
          input.userAgent
        )
      }
      throw error
    }
  }

  private async logAuditEvent(
    email: string,
    status: 'SUCCESS' | 'FAILURE' | 'ERROR',
    message?: string,
    ipAddress?: string,
    userAgent?: string,
    userId?: string
  ) {
    await logAuthEvent(AuditActions.LOGIN, {
      email,
      userId,
      status,
      message,
      ipAddress,
      userAgent,
    })
  }

  private generateTokens(user: User): Tokens {
    return {
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
  }
}
