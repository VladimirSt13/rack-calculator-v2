import { describe, it, expect } from 'vitest'
import { JwtService } from '../infrastructure/jwt.service.js'

// Use actual config (loaded from .env)
describe('JwtService', () => {
  const mockPayload = {
    userId: 'test-user-123',
    email: 'test@example.com',
    role: 'USER' as const,
    roleId: 'test-role-456',
  }

  describe('generateAccessToken', () => {
    it('should generate valid access token', () => {
      const token = JwtService.generateAccessToken(mockPayload)

      expect(token).toBeDefined()
      expect(typeof token).toBe('string')
      expect(token.split('.')).toHaveLength(3)
    })

    it('should include payload data in token', () => {
      const token = JwtService.generateAccessToken(mockPayload)
      const decoded = JwtService.verifyAccessToken(token)

      expect(decoded.userId).toBe(mockPayload.userId)
      expect(decoded.email).toBe(mockPayload.email)
      expect(decoded.role).toBe(mockPayload.role)
      expect(decoded.roleId).toBe(mockPayload.roleId)
    })
  })

  describe('generateRefreshToken', () => {
    it('should generate valid refresh token', () => {
      const token = JwtService.generateRefreshToken(mockPayload)

      expect(token).toBeDefined()
      expect(typeof token).toBe('string')
      expect(token.split('.')).toHaveLength(3)
    })

    it('should include payload data in refresh token', () => {
      const token = JwtService.generateRefreshToken(mockPayload)
      const decoded = JwtService.verifyRefreshToken(token)

      expect(decoded.userId).toBe(mockPayload.userId)
      expect(decoded.email).toBe(mockPayload.email)
    })
  })

  describe('verifyAccessToken', () => {
    it('should verify valid token and return payload', () => {
      const token = JwtService.generateAccessToken(mockPayload)
      const verified = JwtService.verifyAccessToken(token)

      expect(verified.userId).toBe(mockPayload.userId)
      expect(verified.email).toBe(mockPayload.email)
      expect(verified.role).toBe('USER')
    })

    it('should throw for invalid token', () => {
      expect(() => JwtService.verifyAccessToken('invalid-token')).toThrow()
    })
  })

  describe('verifyRefreshToken', () => {
    it('should verify valid refresh token', () => {
      const token = JwtService.generateRefreshToken(mockPayload)
      const verified = JwtService.verifyRefreshToken(token)

      expect(verified.userId).toBe(mockPayload.userId)
    })

    it('should throw for invalid refresh token', () => {
      expect(() => JwtService.verifyRefreshToken('invalid-refresh-token')).toThrow()
    })
  })

  describe('ADMIN role token', () => {
    const adminPayload = {
      userId: 'admin-user-123',
      email: 'admin@example.com',
      role: 'ADMIN' as const,
      roleId: 'admin-role-789',
    }

    it('should generate token with ADMIN role', () => {
      const token = JwtService.generateAccessToken(adminPayload)
      const decoded = JwtService.verifyAccessToken(token)

      expect(decoded.role).toBe('ADMIN')
      expect(decoded.roleId).toBe('admin-role-789')
    })
  })
})
