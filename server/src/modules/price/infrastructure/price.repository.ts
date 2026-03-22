import { PrismaClient, Prisma } from '@prisma/client'
import { Price } from '../domain/entities/price.entity.js'

export class PriceRepository {
  constructor(private readonly prisma: PrismaClient) {}

  /**
   * Find active price list by category
   */
  async findActiveByCategory(category: string): Promise<Price | null> {
    const price = await this.prisma.price.findFirst({
      where: {
        category,
        isActive: true,
      },
      orderBy: { updatedAt: 'desc' },
    })

    if (!price) {
      return null
    }

    return Price.fromPersistence(price)
  }

  /**
   * Find price by ID
   */
  async findById(id: string): Promise<Price | null> {
    const price = await this.prisma.price.findUnique({
      where: { id },
    })

    if (!price) {
      return null
    }

    return Price.fromPersistence(price)
  }

  /**
   * Find all price lists (including inactive)
   */
  async findAll(): Promise<Price[]> {
    const prices = await this.prisma.price.findMany({
      orderBy: { category: 'asc' },
    })

    return prices.map(Price.fromPersistence)
  }

  /**
   * Find active price lists
   */
  async findActive(): Promise<Price[]> {
    const prices = await this.prisma.price.findMany({
      where: { isActive: true },
      orderBy: { category: 'asc' },
    })

    return prices.map(Price.fromPersistence)
  }

  /**
   * Create new price list
   */
  async create(price: Price): Promise<Price> {
    const data = price.toPersistence()
    const created = await this.prisma.price.create({
      data: {
        category: data.category,
        data: data.data as unknown as Prisma.InputJsonValue,
        isActive: data.isActive,
        validFrom: data.validFrom,
        validUntil: data.validUntil,
      },
    })

    return Price.fromPersistence(created)
  }

  /**
   * Update price list
   */
  async update(price: Price): Promise<Price> {
    const data = price.toPersistence()
    const updated = await this.prisma.price.update({
      where: { id: data.id },
      data: {
        data: data.data as unknown as Prisma.InputJsonValue,
        isActive: data.isActive,
        validFrom: data.validFrom,
        validUntil: data.validUntil,
      },
    })

    return Price.fromPersistence(updated)
  }

  /**
   * Activate price list
   */
  async activate(id: string): Promise<Price> {
    const updated = await this.prisma.price.update({
      where: { id },
      data: { isActive: true },
    })

    return Price.fromPersistence(updated)
  }

  /**
   * Deactivate price list
   */
  async deactivate(id: string): Promise<Price> {
    const updated = await this.prisma.price.update({
      where: { id },
      data: { isActive: false },
    })

    return Price.fromPersistence(updated)
  }

  /**
   * Delete price list
   */
  async delete(id: string): Promise<void> {
    await this.prisma.price.delete({
      where: { id },
    })
  }

  /**
   * Check if category exists
   */
  async existsByCategory(category: string): Promise<boolean> {
    const price = await this.prisma.price.findFirst({
      where: { category },
      select: { id: true },
    })

    return !!price
  }
}
