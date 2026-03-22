import { IAuditRepository, IAuditFilters } from '../../infrastructure/AuditRepository.js'
import { IAuditEvent } from '../../domain/entities/AuditEvent.js'

export interface ILogAuditAction {
  execute(data: ILogAuditActionData): Promise<void>
}

export interface ILogAuditActionData {
  action: string
  resource: string
  resourceId?: string
  userId?: string
  metadata?: Record<string, unknown>
  ipAddress?: string
  userAgent?: string
  status?: 'SUCCESS' | 'FAILURE' | 'ERROR'
  message?: string
}

export class LogAuditActionUseCase implements ILogAuditAction {
  constructor(private auditRepository: IAuditRepository) {}

  async execute(data: ILogAuditActionData): Promise<void> {
    await this.auditRepository.create({
      action: data.action,
      resource: data.resource,
      resourceId: data.resourceId,
      userId: data.userId,
      metadata: data.metadata,
      ipAddress: data.ipAddress,
      userAgent: data.userAgent,
      status: data.status ?? 'SUCCESS',
      message: data.message,
    })
  }
}

export interface IGetAuditLogs {
  execute(filters: IAuditFilters): Promise<IAuditEvent[]>
}

export class GetAuditLogsUseCase implements IGetAuditLogs {
  constructor(private auditRepository: IAuditRepository) {}

  async execute(filters: IAuditFilters): Promise<IAuditEvent[]> {
    return this.auditRepository.findMany(filters)
  }
}
