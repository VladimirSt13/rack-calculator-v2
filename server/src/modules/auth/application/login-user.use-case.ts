import { UserRepository } from '../../users/infrastructure/user.repository.js'
import { Email } from '../../users/domain/value-objects/email.vo.js'
import { Password } from '../../users/domain/value-objects/password.vo.js'
import { User } from '../../users/domain/entities/user.entity.js'
import { AppError } from '../../common/errors/app.error.js'
import { JwtService, Tokens } from '../infrastructure/jwt.service.js'

export interface LoginInput {
  email: string
  password: string
}

export interface LoginOutput {
  user: User
  tokens: Tokens
}

export class LoginUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(input: LoginInput): Promise<LoginOutput> {
    const email = new Email(input.email)

    // Поиск пользователя
    const user = await this.userRepository.findByEmail(email)
    if (!user) {
      throw AppError.unauthorized('Invalid credentials', 'INVALID_CREDENTIALS')
    }

    // Проверка пароля
    const passwordValid = await Password.compare(input.password, user.passwordHash)
    if (!passwordValid) {
      throw AppError.unauthorized('Invalid credentials', 'INVALID_CREDENTIALS')
    }

    // Генерация токенов
    const tokens = this.generateTokens(user)

    // Сохранение refresh токена
    user.setRefreshToken(tokens.refreshToken)
    await this.userRepository.update(user)

    return {
      user,
      tokens,
    }
  }

  private generateTokens(user: User): Tokens {
    return {
      accessToken: JwtService.generateAccessToken({
        userId: user.id,
        email: user.email.toString(),
        role: user.role,
      }),
      refreshToken: JwtService.generateRefreshToken({
        userId: user.id,
        email: user.email.toString(),
        role: user.role,
      }),
    }
  }
}
