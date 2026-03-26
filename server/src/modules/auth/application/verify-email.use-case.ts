import { UserRepository } from '../../users/infrastructure/user.repository.js'
import { Email } from '../../users/domain/value-objects/email.vo.js'
import { AppError } from '../../common/errors/app.error.js'
import { emailService } from '../../email/email.service.js'

export interface VerifyEmailInput {
  token: string
  userId: string
}

export class VerifyEmailUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(input: VerifyEmailInput): Promise<void> {
    const user = await this.userRepository.findById(input.userId)

    if (!user) {
      throw AppError.notFound('User not found', 'USER_NOT_FOUND')
    }

    // Перевірка токена (в реальному застосунку токен зберігається в БД)
    // Тут спрощена версія - токен повинен збігатися з resetToken
    if (user.resetToken !== input.token) {
      throw AppError.badRequest('Invalid verification token', 'INVALID_TOKEN')
    }

    user.verifyEmail()
    await this.userRepository.update(user)
  }
}

export class SendVerificationEmailUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(email: string): Promise<{ success: boolean; message: string }> {
    const userEmail = new Email(email)
    const user = await this.userRepository.findByEmail(userEmail)

    if (!user) {
      // Не розкриваємо інформацію про існування користувача для безпеки
      return { success: true, message: 'Якщо email існує, лист відправлено' }
    }

    if (user.emailVerified) {
      throw AppError.conflict('Email already verified', 'EMAIL_ALREADY_VERIFIED')
    }

    // Генерація токена верифікації
    const token = crypto.randomUUID()
    const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 години

    // Збереження токена в БД
    user.resetToken = token
    user.resetTokenExpiry = tokenExpiry
    await this.userRepository.update(user)

    // Відправка email
    try {
      await emailService.sendVerificationEmail(user.email.toString(), token, user.id)
    } catch (error) {
      console.error('Failed to send verification email:', error)
      // Не показуємо помилку користувачу для безпеки
    }

    return { success: true, message: 'Якщо email існує, лист відправлено' }
  }
}
