import { User } from '../domain/entities/user.entity.js'
import { Email } from '../domain/value-objects/email.vo.js'

// In-memory хранилище для разработки без БД
const users = new Map<string, User>()

export class InMemoryUserRepository {
  async findByEmail(email: Email): Promise<User | null> {
    const user = Array.from(users.values()).find(
      u => u.email.toString() === email.toString(),
    )
    return user || null
  }

  async findById(id: string): Promise<User | null> {
    return users.get(id) || null
  }

  async findByResetToken(token: string): Promise<User | null> {
    const user = Array.from(users.values()).find(u => u.resetToken === token)
    return user || null
  }

  async create(user: User): Promise<User> {
    users.set(user.id, user)
    return user
  }

  async update(user: User): Promise<User> {
    users.set(user.id, user)
    return user
  }

  async existsByEmail(email: Email): Promise<boolean> {
    const user = await this.findByEmail(email)
    return !!user
  }
}
