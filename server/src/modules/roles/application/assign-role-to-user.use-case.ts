import { UserRepository } from '../../users/infrastructure/user.repository.js'
import { RoleRepository } from '../infrastructure/role.repository.js'

export interface AssignRoleToUserRequest {
  userId: string
  roleId: string
}

export class AssignRoleToUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly roleRepository: RoleRepository
  ) {}

  async execute(request: AssignRoleToUserRequest): Promise<void> {
    const { userId, roleId } = request

    // Find user
    const user = await this.userRepository.findById(userId)
    if (!user) {
      throw new Error('User not found')
    }

    // Find role
    const role = await this.roleRepository.findById(roleId)
    if (!role) {
      throw new Error('Role not found')
    }

    // Assign role
    user.setRoleId(roleId)
    await this.userRepository.update(user)
  }
}
