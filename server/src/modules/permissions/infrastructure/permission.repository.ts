import { PrismaClient } from '@prisma/client'
import { Permission } from '../domain/entities/permission.entity.js'

export class PermissionRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<Permission | null> {
    const permission = await this.prisma.permission.findUnique({
      where: { id },
    })

    if (!permission) {
      return null
    }

    return Permission.fromPersistence(permission)
  }

  async findByName(name: string): Promise<Permission | null> {
    const permission = await this.prisma.permission.findUnique({
      where: { name },
    })

    if (!permission) {
      return null
    }

    return Permission.fromPersistence(permission)
  }

  async findByResource(resource: string): Promise<Permission[]> {
    const permissions = await this.prisma.permission.findMany({
      where: { resource },
    })

    return permissions.map(Permission.fromPersistence)
  }

  async findAll(): Promise<Permission[]> {
    const permissions = await this.prisma.permission.findMany({
      orderBy: { resource: 'asc' },
    })

    return permissions.map(Permission.fromPersistence)
  }

  async create(permission: Permission): Promise<Permission> {
    const created = await this.prisma.permission.create({
      data: permission.toPersistence(),
    })

    return Permission.fromPersistence(created)
  }

  async update(permission: Permission): Promise<Permission> {
    const { id, ...data } = permission.toPersistence()
    const updated = await this.prisma.permission.update({
      where: { id },
      data,
    })

    return Permission.fromPersistence(updated)
  }

  async delete(id: string): Promise<void> {
    await this.prisma.permission.delete({
      where: { id },
    })
  }

  async existsByName(name: string): Promise<boolean> {
    const permission = await this.prisma.permission.findUnique({
      where: { name },
      select: { id: true },
    })

    return !!permission
  }
}
