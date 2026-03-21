import { PrismaClient } from '@prisma/client'
import { User } from '../domain/entities/user.entity.js'
import { Email } from '../domain/value-objects/email.vo.js'

export class UserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findByEmail(email: Email): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email: email.toString() },
    })

    if (!user) {
      return null
    }

    return User.fromPersistence(user)
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    })

    if (!user) {
      return null
    }

    return User.fromPersistence(user)
  }

  async findByResetToken(token: string): Promise<User | null> {
    const user = await this.prisma.user.findFirst({
      where: { resetToken: token },
    })

    if (!user) {
      return null
    }

    return User.fromPersistence(user)
  }

  async create(user: User): Promise<User> {
    const data = user.toPersistence()
    const { id, role, ...rest } = data
    const created = await this.prisma.user.create({
      data: {
        ...rest,
        roleId: data.roleId || null,
      },
    })

    return User.fromPersistence(created)
  }

  async update(user: User): Promise<User> {
    const data = user.toPersistence()
    const { id, role, ...rest } = data
    const updated = await this.prisma.user.update({
      where: { id },
      data: {
        ...rest,
        roleId: data.roleId || null,
      },
    })

    return User.fromPersistence(updated)
  }

  async existsByEmail(email: Email): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { email: email.toString() },
      select: { id: true },
    })

    return !!user
  }
}
