import { UserRepository } from '../../users/infrastructure/user.repository.js'
import { AppError } from '../../common/errors/app.error.js'

export interface VerifyEmailInput {
  token: string
}

export class VerifyEmailUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(input: VerifyEmailInput): Promise<void> {
    // В реальном приложении токен был бы связан с пользователем
    // Здесь упрощённая реализация для демонстрации
    const user = await this.userRepository.findByResetToken(input.token)

    if (!user) {
      throw AppError.notFound('User not found', 'USER_NOT_FOUND')
    }

    user.verifyEmail()
    await this.userRepository.update(user)
  }
}

export class SendVerificationEmailUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(email: string): Promise<{ token: string }> {
    const user = await this.userRepository.findByEmail(new (await import('../../users/domain/value-objects/email.vo.js')).Email(email))

    if (!user) {
      throw AppError.notFound('User not found', 'USER_NOT_FOUND')
    }

    if (user.emailVerified) {
      throw AppError.conflict('Email already verified', 'EMAIL_ALREADY_VERIFIED')
    }

    // Генерация токена верификации
    const token = crypto.randomUUID()

    // В реальном приложении здесь была бы отправка email
    // await emailService.sendVerification(user.email.toString(), token)

    return { token }
  }
}
