export type AuditStatus = 'SUCCESS' | 'FAILURE' | 'ERROR'

export type AuditAction =
  | 'LOGIN'
  | 'LOGOUT'
  | 'REGISTER'
  | 'PASSWORD_RESET_REQUEST'
  | 'PASSWORD_RESET_CONFIRM'
  | 'USER_CREATE'
  | 'USER_UPDATE'
  | 'USER_DELETE'
  | 'ROLE_CREATE'
  | 'ROLE_UPDATE'
  | 'ROLE_DELETE'
  | 'ROLE_ASSIGN'
  | 'ROLE_REVOKE'
  | 'PERMISSION_CREATE'
  | 'PERMISSION_UPDATE'
  | 'PERMISSION_DELETE'
  | 'RACK_CALCULATE'
  | 'RACK_SAVE'
  | 'RACK_UPDATE'
  | 'RACK_DELETE'
  | 'BATTERY_CALCULATE'
  | 'BATTERY_SAVE'
  | 'EXPORT_RACK'

export type AuditResource =
  | 'auth'
  | 'users'
  | 'roles'
  | 'permissions'
  | 'rack'
  | 'battery'
  | 'export'

export interface AuditLog {
  id: string
  action: AuditAction
  resource: AuditResource
  resourceId?: string
  userId?: string
  user?: {
    id: string
    email: string
    firstName?: string
    lastName?: string
  }
  metadata?: Record<string, unknown>
  ipAddress?: string
  userAgent?: string
  status: AuditStatus
  message?: string
  createdAt: string
}

export interface AuditFilters {
  userId?: string
  action?: AuditAction
  resource?: AuditResource
  status?: AuditStatus
  startDate?: string
  endDate?: string
  limit?: number
  skip?: number
}

export interface AuditLogsResponse {
  success: boolean
  data: {
    logs: AuditLog[]
    pagination: {
      total: number
      limit: number
      skip: number
    }
  }
}
