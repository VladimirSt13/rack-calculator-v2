export interface IAuditEvent {
  id: string
  action: string
  resource: string
  resourceId?: string
  userId?: string
  metadata?: Record<string, unknown>
  ipAddress?: string
  userAgent?: string
  status: 'SUCCESS' | 'FAILURE' | 'ERROR'
  message?: string
  createdAt: Date
}

export interface IAuditEventCreate {
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
