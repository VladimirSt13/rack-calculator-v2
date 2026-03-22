import { api } from './api'
import type { AuditFilters, AuditLogsResponse, AuditLog } from '@/types/audit.types'

export const auditService = {
  /**
   * Get all audit logs (ADMIN only)
   */
  getLogs: async (filters?: AuditFilters): Promise<AuditLogsResponse> => {
    const params = new URLSearchParams()

    if (filters?.userId) params.append('userId', filters.userId)
    if (filters?.action) params.append('action', filters.action)
    if (filters?.resource) params.append('resource', filters.resource)
    if (filters?.status) params.append('status', filters.status)
    if (filters?.startDate) params.append('startDate', filters.startDate)
    if (filters?.endDate) params.append('endDate', filters.endDate)
    if (filters?.limit) params.append('limit', filters.limit.toString())
    if (filters?.skip) params.append('skip', filters.skip.toString())

    const response = await api.get<AuditLogsResponse>(`/audit?${params.toString()}`)
    return response.data
  },

  /**
   * Get current user's audit logs
   */
  getMyLogs: async (limit = 50, skip = 0): Promise<AuditLog[]> => {
    const response = await api.get<AuditLog[]>(`/audit/my?limit=${limit}&skip=${skip}`)
    return response.data
  },

  /**
   * Get single audit log by ID (ADMIN only)
   */
  getLogById: async (id: string): Promise<AuditLog> => {
    const response = await api.get<{ success: boolean; data: AuditLog }>(`/audit/${id}`)
    return response.data.data
  },
}
