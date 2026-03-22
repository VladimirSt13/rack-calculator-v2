export const AuditResources = {
  AUTH: 'auth',
  USERS: 'users',
  ROLES: 'roles',
  PERMISSIONS: 'permissions',
  RACK: 'rack',
  BATTERY: 'battery',
  EXPORT: 'export',
} as const

export type AuditResource = typeof AuditResources[keyof typeof AuditResources]
