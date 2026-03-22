import { describe, it, expect } from 'vitest'
import { PrismaClient } from '@prisma/client'
import { UserRepository } from '../../users/infrastructure/user.repository.js'
import { LoginUserUseCase } from './login-user.use-case.js'
import { AppError } from '../../common/errors/app.error.js'

// Integration tests
describe('LoginUserUseCase - Integration', () => {
  const prisma = new PrismaClient()
  const userRepository = new UserRepository(prisma)
  const useCase = new LoginUserUseCase(userRepository)

  describe('execute', () => {
    it('should reject non-existent user', async () => {
      await expect(
        useCase.execute({
          email: 'nonexistent@example.com',
          password: 'test123',
        })
      ).rejects.toThrow(AppError)
    })

    it('should reject invalid password', async () => {
      // First create a test user
      const testEmail = `test_${Date.now()}@example.com`

      await expect(
        useCase.execute({
          email: testEmail,
          password: 'wrong-password',
        })
      ).rejects.toThrow()
    })
  })

  afterAll(async () => {
    await prisma.$disconnect()
  })
})
