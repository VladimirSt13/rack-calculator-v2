import { Role } from './entities/role.entity.js'

/**
 * Policy service for checking permissions
 * Pure domain logic - no infrastructure dependencies
 */
export class PolicyService {
  /**
   * Check if a role has a specific permission by ID
   */
  static canById(role: Role, permissionId: string): boolean {
    return role.permissionIds.includes(permissionId)
  }

  /**
   * Check if a role has ANY of the specified permissions
   */
  static canAny(role: Role, permissionIds: string[]): boolean {
    return permissionIds.some((id) => role.permissionIds.includes(id))
  }

  /**
   * Check if a role has ALL of the specified permissions
   */
  static canAll(role: Role, permissionIds: string[]): boolean {
    return permissionIds.every((id) => role.permissionIds.includes(id))
  }
}
