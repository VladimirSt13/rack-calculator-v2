import type { Prisma, PrismaClient } from '@prisma/client'
import type { RackConfiguration, RackPricing } from '../domain/entities/rack.entity'
import type { RackResult } from '../domain/calculateRack'
import { RackEntity } from '../domain/entities/rack.entity'

/**
 * DTO для создания нового RackSet
 */
export interface CreateRackDto {
  name: string
  description: string
  configuration: RackConfiguration
  components: RackResult['components']
  totalLength: number
  pricing?: RackPricing
  userId: string
}

/**
 * DTO для обновления RackSet
 */
export interface UpdateRackDto {
  name?: string
  description?: string
  pricing?: RackPricing
}

/**
 * Rack Repository
 * Отвечает за сохранение и загрузку RackEntity из БД
 */
export class RackRepository {
  constructor(private readonly prisma: PrismaClient) {}

  /**
   * Создание нового RackSet
   */
  async create(data: CreateRackDto): Promise<RackEntity> {
    const created = await this.prisma.rackSet.create({
      data: {
        name: data.name,
        description: data.description,
        configuration: data.configuration as unknown as Prisma.InputJsonValue,
        components: data.components as unknown as Prisma.InputJsonValue,
        totalLength: data.totalLength,
        pricing: data.pricing as unknown as Prisma.InputJsonValue,
        userId: data.userId,
        isDeleted: false,
      },
    })

    return this.mapToEntity(created)
  }

  /**
   * Получение RackSet по ID
   */
  async findById(id: string): Promise<RackEntity | null> {
    const rackSet = await this.prisma.rackSet.findUnique({
      where: { id, isDeleted: false },
      include: {
        revisions: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    })

    if (!rackSet) {
      return null
    }

    return this.mapToEntity(rackSet)
  }

  /**
   * Получение всех RackSet пользователя
   */
  async findByUserId(userId: string, take = 50, skip = 0): Promise<RackEntity[]> {
    const rackSets = await this.prisma.rackSet.findMany({
      where: {
        userId,
        isDeleted: false,
      },
      orderBy: { createdAt: 'desc' },
      take,
      skip,
    })

    return rackSets.map((r) => this.mapToEntity(r))
  }

  /**
   * Обновление RackSet
   */
  async update(id: string, data: UpdateRackDto): Promise<RackEntity | null> {
    const updateData: Prisma.RackSetUpdateInput = {}

    if (data.name) {
      updateData.name = data.name
    }
    if (data.description) {
      updateData.description = data.description
    }
    if (data.pricing) {
      updateData.pricing = data.pricing as unknown as Prisma.InputJsonValue
    }

    const updated = await this.prisma.rackSet.update({
      where: { id, isDeleted: false },
      data: updateData,
    })

    return this.mapToEntity(updated)
  }

  /**
   * Удаление RackSet (soft delete)
   */
  async delete(id: string, userId: string): Promise<boolean> {
    const updated = await this.prisma.rackSet.updateMany({
      where: {
        id,
        userId,
        isDeleted: false,
      },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    })

    return updated.count > 0
  }

  /**
   * Восстановление удалённого RackSet
   */
  async restore(id: string, userId: string): Promise<boolean> {
    const updated = await this.prisma.rackSet.updateMany({
      where: {
        id,
        userId,
        isDeleted: true,
      },
      data: {
        isDeleted: false,
        deletedAt: null,
      },
    })

    return updated.count > 0
  }

  /**
   * Создание ревизии RackSet
   */
  async createRevision(rackSetId: string, version: number, data: object): Promise<void> {
    await this.prisma.rackRevision.create({
      data: {
        rackSetId,
        version,
        data: data as unknown as Prisma.InputJsonValue,
      },
    })
  }

  /**
   * Получение ревизий RackSet
   */
  async getRevisions(rackSetId: string, limit = 10): Promise<object[]> {
    const revisions = await this.prisma.rackRevision.findMany({
      where: { rackSetId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    })

    return revisions.map((r) => r.data as object)
  }

  /**
   * Маппинг из persistence в entity
   */
  private mapToEntity(data: Prisma.RackSetGetPayload<{}>): RackEntity {
    return RackEntity.fromPersistence({
      id: data.id,
      name: data.name,
      description: data.description,
      configuration: data.configuration as unknown as RackConfiguration,
      components: data.components as unknown as RackResult['components'],
      totalLength: data.totalLength,
      pricing: data.pricing as unknown as RackPricing,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    })
  }
}
