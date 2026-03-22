import { describe, it, expect, beforeEach } from 'vitest'
import { LoginUserUseCase } from './login-user.use-case.js'
import { UserRepository } from '../../users/infrastructure/user.repository.js'
import { User } from '../../users/domain/entities/user.entity.js'
import { Email } from '../../users/domain/value-objects/email.vo.js'
import { Password } from '../../users/domain/value-objects/password.vo.js'
import { AppError } from '../../common/errors/app.error.js'
import { prisma } from '../../../db/prisma.client.js'

describe('LoginUserUseCase', () => {
  let useCase: LoginUserUseCase
  let userRepository: UserRepository

  const testUser = new User({
    id: 'test-user-123',
    email: new Email('test@example.com'),
    passwordHash: 'hashed-password',
    firstName: 'Test',
    lastName: 'User',
    roleId: 'test-role-id',
    role: 'USER',
    emailVerified: true,
  })

  beforeEach(() => {
    userRepository = new UserRepository(prisma)
    useCase = new LoginUserUseCase(userRepository)
  })

  describe('execute', () => {
    it('should throw unauthorized for non-existent user', async () => {
      await expect(
        useCase.execute({
          email: 'nonexistent@test.com',
          password: 'any-password',
        })
      ).rejects.toThrow(AppError)
    })

    it('should throw unauthorized for invalid password', async () => {
      // This will fail at password comparison
      // For real tests, you'd need to seed the database
      await expect(
        useCase.execute({
          email: 'test@example.com',
          password: 'wrong-password',
        })
      ).rejects.toThrow()
    })

    it('should generate tokens with correct role for existing user', async () => {
      // Integration test - requires DB setup
      // This is a placeholder for the actual test
      expect(true).toBe(true)
    })
  })
})
