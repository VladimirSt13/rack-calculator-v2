import { PrismaClient } from '@prisma/client'
import { Role } from '../domain/entities/role.entity.js'

export class RoleRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<Role | null> {
    const role = await this.prisma.role.findUnique({
      where: { id },
    })

    if (!role) {
      return null
    }

    return Role.fromPersistence(role)
  }

  async findByName(name: string): Promise<Role | null> {
    const role = await this.prisma.role.findUnique({
      where: { name },
    })

    if (!role) {
      return null
    }

    return Role.fromPersistence(role)
  }

  async findAll(): Promise<Role[]> {
    const roles = await this.prisma.role.findMany({
      include: {
        users: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    })

    return roles.map(Role.fromPersistence)
  }

  async create(role: Role): Promise<Role> {
    const created = await this.prisma.role.create({
      data: role.toPersistence(),
    })

    return Role.fromPersistence(created)
  }

  async update(role: Role): Promise<Role> {
    const { id, ...data } = role.toPersistence()
    const updated = await this.prisma.role.update({
      where: { id },
      data,
    })

    return Role.fromPersistence(updated)
  }

  async addPermissions(roleId: string, permissionIds: string[]): Promise<Role> {
    const role = await this.prisma.role.findUnique({
      where: { id: roleId },
    })

    if (!role) {
      throw new Error(`Role not found: ${roleId}`)
    }

    const updatedPermissionIds = Array.from(
      new Set([...role.permissionIds, ...permissionIds])
    )

    const updated = await this.prisma.role.update({
      where: { id: roleId },
      data: { permissionIds: updatedPermissionIds },
    })

    return Role.fromPersistence(updated)
  }

  async removePermissions(roleId: string, permissionIds: string[]): Promise<Role> {
    const role = await this.prisma.role.findUnique({
      where: { id: roleId },
    })

    if (!role) {
      throw new Error(`Role not found: ${roleId}`)
    }

    const updatedPermissionIds = role.permissionIds.filter(
      id => !permissionIds.includes(id)
    )

    const updated = await this.prisma.role.update({
      where: { id: roleId },
      data: { permissionIds: updatedPermissionIds },
    })

    return Role.fromPersistence(updated)
  }

  async delete(id: string): Promise<void> {
    await this.prisma.role.delete({
      where: { id },
    })
  }

  async existsByName(name: string): Promise<boolean> {
    const role = await this.prisma.role.findUnique({
      where: { name },
      select: { id: true },
    })

    return !!role
  }
}
