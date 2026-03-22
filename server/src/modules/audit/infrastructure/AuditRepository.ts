import { PrismaClient, AuditEvent as PrismaAuditEvent } from '@prisma/client'
import { IAuditEvent, IAuditEventCreate } from '../domain/entities/AuditEvent.js'

export interface IAuditFilters {
  userId?: string
  action?: string
  resource?: string
  status?: 'SUCCESS' | 'FAILURE' | 'ERROR'
  startDate?: Date
  endDate?: Date
  limit?: number
  skip?: number
}

export interface IAuditRepository {
  create(data: IAuditEventCreate): Promise<IAuditEvent>
  findById(id: string): Promise<IAuditEvent | null>
  findMany(filters: IAuditFilters): Promise<IAuditEvent[]>
  count(filters: IAuditFilters): Promise<number>
  deleteOlderThan(days: number): Promise<number>
}

export class AuditRepository implements IAuditRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: IAuditEventCreate): Promise<IAuditEvent> {
    const auditEvent: PrismaAuditEvent = await this.prisma.auditEvent.create({
      data: {
        action: data.action,
        resource: data.resource,
        resourceId: data.resourceId,
        userId: data.userId,
        metadata: (data.metadata as PrismaAuditEvent['metadata']) ?? null,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
        status: data.status ?? 'SUCCESS',
        message: data.message,
      },
    })

    return this.mapToEntity(auditEvent)
  }

  async findById(id: string): Promise<IAuditEvent | null> {
    const auditEvent = await this.prisma.auditEvent.findUnique({
      where: { id },
      include: { user: true },
    })

    if (!auditEvent) return null
    return this.mapToEntity(auditEvent)
  }

  async findMany(filters: IAuditFilters): Promise<IAuditEvent[]> {
    const { userId, action, resource, status, startDate, endDate, limit = 50, skip = 0 } = filters

    const where: Record<string, unknown> = {}

    if (userId) where.userId = userId
    if (action) where.action = action
    if (resource) where.resource = resource
    if (status) where.status = status

    if (startDate || endDate) {
      where.createdAt = {} as Record<string, unknown>
      if (startDate) (where.createdAt as Record<string, unknown>).gte = startDate
      if (endDate) (where.createdAt as Record<string, unknown>).lte = endDate
    }

    const auditEvents = await this.prisma.auditEvent.findMany({
      where,
      include: { user: true },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip,
    })

    return auditEvents.map((event) => this.mapToEntity(event))
  }

  async count(filters: IAuditFilters): Promise<number> {
    const { userId, action, resource, status, startDate, endDate } = filters

    const where: Record<string, unknown> = {}

    if (userId) where.userId = userId
    if (action) where.action = action
    if (resource) where.resource = resource
    if (status) where.status = status

    if (startDate || endDate) {
      where.createdAt = {} as Record<string, unknown>
      if (startDate) (where.createdAt as Record<string, unknown>).gte = startDate
      if (endDate) (where.createdAt as Record<string, unknown>).lte = endDate
    }

    return this.prisma.auditEvent.count({ where })
  }

  async deleteOlderThan(days: number): Promise<number> {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - days)

    const { count } = await this.prisma.auditEvent.deleteMany({
      where: {
        createdAt: {
          lt: cutoffDate,
        },
      },
    })

    return count
  }

  private mapToEntity(prismaEvent: PrismaAuditEvent & { user?: unknown }): IAuditEvent {
    return {
      id: prismaEvent.id,
      action: prismaEvent.action,
      resource: prismaEvent.resource,
      resourceId: prismaEvent.resourceId ?? undefined,
      userId: prismaEvent.userId ?? undefined,
      metadata: (prismaEvent.metadata as Record<string, unknown>) ?? undefined,
      ipAddress: prismaEvent.ipAddress ?? undefined,
      userAgent: prismaEvent.userAgent ?? undefined,
      status: prismaEvent.status as 'SUCCESS' | 'FAILURE' | 'ERROR',
      message: prismaEvent.message ?? undefined,
      createdAt: prismaEvent.createdAt,
    }
  }
}
