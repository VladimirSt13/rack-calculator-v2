import { RoleRepository } from '../infrastructure/role.repository.js'
import { PermissionRepository } from '../../permissions/infrastructure/permission.repository.js'

export interface CheckPermissionRequest {
  roleId: string
  resource: string
  action: string
}

export interface CheckPermissionResponse {
  allowed: boolean
  reason?: string
}

export class CheckPermissionUseCase {
  constructor(
    private readonly roleRepository: RoleRepository,
    private readonly permissionRepository: PermissionRepository
  ) {}

  async execute(request: CheckPermissionRequest): Promise<CheckPermissionResponse> {
    const { roleId, resource, action } = request

    // Find role
    const role = await this.roleRepository.findById(roleId)
    if (!role) {
      return {
        allowed: false,
        reason: 'Role not found',
      }
    }

    // Find permission
    const permissions = await this.permissionRepository.findByResource(resource)
    const matchingPermission = permissions.find((p) => p.action === action)

    if (!matchingPermission) {
      return {
        allowed: false,
        reason: 'Permission not found',
      }
    }

    // Check if role has the permission
    const hasPermission = role.permissionIds.includes(matchingPermission.id)

    return {
      allowed: hasPermission,
      reason: hasPermission ? undefined : 'Permission denied',
    }
  }
}
