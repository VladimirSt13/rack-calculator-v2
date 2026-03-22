import { describe, it, expect } from 'vitest'
import { JwtService } from '../infrastructure/jwt.service.js'

// Simple unit tests without complex setup
describe('JwtService', () => {
  const testPayload = {
    userId: 'test-user-123',
    email: 'test@example.com',
    role: 'USER' as const,
    roleId: 'test-role-456',
  }

  it('should generate valid access token', () => {
    const token = JwtService.generateAccessToken(testPayload)

    expect(token).toBeDefined()
    expect(typeof token).toBe('string')
    expect(token.split('.')).toHaveLength(3)
  })

  it('should verify and decode payload correctly', () => {
    const token = JwtService.generateAccessToken(testPayload)
    const decoded = JwtService.verifyAccessToken(token)

    expect(decoded.userId).toBe(testPayload.userId)
    expect(decoded.email).toBe(testPayload.email)
    expect(decoded.role).toBe(testPayload.role)
    expect(decoded.roleId).toBe(testPayload.roleId)
  })

  it('should generate valid refresh token', () => {
    const token = JwtService.generateRefreshToken(testPayload)
    expect(token).toBeDefined()
  })

  it('should verify refresh token', () => {
    const token = JwtService.generateRefreshToken(testPayload)
    const decoded = JwtService.verifyRefreshToken(token)

    expect(decoded.userId).toBe(testPayload.userId)
  })

  it('should throw on invalid access token', () => {
    expect(() => JwtService.verifyAccessToken('invalid.token.here')).toThrow()
  })

  it('should throw on invalid refresh token', () => {
    expect(() => JwtService.verifyRefreshToken('invalid.token.here')).toThrow()
  })

  it('should generate ADMIN role token', () => {
    const adminPayload = {
      userId: 'admin-123',
      email: 'admin@example.com',
      role: 'ADMIN' as const,
      roleId: 'admin-role-789',
    }

    const token = JwtService.generateAccessToken(adminPayload)
    const decoded = JwtService.verifyAccessToken(token)

    expect(decoded.role).toBe('ADMIN')
    expect(decoded.roleId).toBe('admin-role-789')
  })
})
