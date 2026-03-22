import { UserRepository } from '../../users/infrastructure/user.repository.js'
import { Email } from '../../users/domain/value-objects/email.vo.js'
import { Password } from '../../users/domain/value-objects/password.vo.js'
import { AppError } from '../../common/errors/app.error.js'
import { emailService } from '../../email/email.service.js'

export interface ResetPasswordInput {
  token: string
  userId: string
  newPassword: string
}

export class ResetPasswordUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(input: ResetPasswordInput): Promise<void> {
    // Поиск пользователя по ID
    const user = await this.userRepository.findById(input.userId)
    if (!user) {
      throw AppError.unauthorized('Invalid reset token', 'INVALID_RESET_TOKEN')
    }

    // Проверка токена
    if (user.resetToken !== input.token) {
      throw AppError.unauthorized('Invalid reset token', 'INVALID_RESET_TOKEN')
    }

    // Проверка срока действия токена
    if (user.resetTokenExpiry && user.resetTokenExpiry < new Date()) {
      throw AppError.unauthorized('Reset token expired', 'RESET_TOKEN_EXPIRED')
    }

    // Хэширование нового пароля
    const password = new Password(input.newPassword)
    const passwordHash = await password.hash()

    // Обновление пароля
    user.updatePassword(passwordHash)
    user.setResetToken(null, null)
    await this.userRepository.update(user)
  }
}

export interface RequestResetPasswordInput {
  email: string
}

export class RequestResetPasswordUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(input: RequestResetPasswordInput): Promise<{ success: boolean; message: string }> {
    const email = new Email(input.email)

    const user = await this.userRepository.findByEmail(email)
    if (!user) {
      // Не раскрываем информацию о существовании пользователя
      return { success: true, message: 'Если email существует, письмо отправлено' }
    }

    // Генерация токена
    const token = crypto.randomUUID()
    const expiry = new Date(Date.now() + 60 * 60 * 1000) // 1 час

    user.setResetToken(token, expiry)
    await this.userRepository.update(user)

    // Отправка email
    try {
      await emailService.sendResetPasswordEmail(user.email.toString(), token, user.id)
    } catch (error) {
      console.error('Failed to send reset password email:', error)
      // Не показываем ошибку пользователю для безопасности
    }

    return { success: true, message: 'Если email существует, письмо отправлено' }
  }
}
