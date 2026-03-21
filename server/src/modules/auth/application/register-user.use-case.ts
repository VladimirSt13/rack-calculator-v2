import { UserRepository } from '../../users/infrastructure/user.repository.js'
import { Email } from '../../users/domain/value-objects/email.vo.js'
import { Password } from '../../users/domain/value-objects/password.vo.js'
import { User } from '../../users/domain/entities/user.entity.js'
import { AppError } from '../../common/errors/app.error.js'
import { JwtService, Tokens } from '../infrastructure/jwt.service.js'

export interface RegisterInput {
  email: string
  password: string
  firstName?: string
  lastName?: string
}

export interface RegisterOutput {
  user: User
  tokens: Tokens
}

export class RegisterUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(input: RegisterInput): Promise<RegisterOutput> {
    const email = new Email(input.email)

    // Проверка существования пользователя
    const exists = await this.userRepository.existsByEmail(email)
    if (exists) {
      throw AppError.conflict('Email already registered', 'EMAIL_EXISTS')
    }

    // Хэширование пароля
    const password = new Password(input.password)
    const passwordHash = await password.hash()

    // Создание пользователя
    const user = new User({
      email,
      passwordHash,
      firstName: input.firstName,
      lastName: input.lastName,
      role: 'USER',
      emailVerified: false,
    })

    const createdUser = await this.userRepository.create(user)

    // Генерация токенов
    const tokens = this.generateTokens(createdUser)

    // Сохранение refresh токена
    createdUser.setRefreshToken(tokens.refreshToken)
    await this.userRepository.update(createdUser)

    return {
      user: createdUser,
      tokens,
    }
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
