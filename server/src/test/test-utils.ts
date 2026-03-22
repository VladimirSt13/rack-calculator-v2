import { PrismaClient } from '@prisma/client'
import { beforeEach, afterEach, vi } from 'vitest'

// Mock Prisma
export const mockPrisma = {
  user: {
    findUnique: vi.fn(),
    findFirst: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  role: {
    findUnique: vi.fn(),
    findFirst: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  auditEvent: {
    create: vi.fn(),
    findUnique: vi.fn(),
    findMany: vi.fn(),
    count: vi.fn(),
    deleteMany: vi.fn(),
  },
  $disconnect: vi.fn(),
} as unknown as PrismaClient

// Reset mocks before each test
beforeEach(() => {
  vi.clearAllMocks()
})

afterEach(() => {
  vi.clearAllMocks()
})

// Test data helpers
export const testUsers = {
  admin: {
    id: 'test-user-id-1',
    email: 'admin@test.com',
    password: 'hashed-password-123',
    firstName: 'Test',
    lastName: 'Admin',
    roleId: 'test-role-id-1',
    role: 'ADMIN' as const,
    emailVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  user: {
    id: 'test-user-id-2',
    email: 'user@test.com',
    password: 'hashed-password-456',
    firstName: 'Test',
    lastName: 'User',
    roleId: 'test-role-id-2',
    role: 'USER' as const,
    emailVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
}

export const testRoles = {
  admin: {
    id: 'test-role-id-1',
    name: 'ADMIN',
    description: 'Administrator',
    permissionIds: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  user: {
    id: 'test-role-id-2',
    name: 'USER',
    description: 'Regular user',
    permissionIds: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
}
