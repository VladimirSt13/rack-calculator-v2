export interface RoleProps {
  id?: string
  name: string
  description?: string
  permissionIds?: string[]
  createdAt?: Date
  updatedAt?: Date
}

export class Role {
  public readonly id: string
  public name: string
  public description?: string
  public permissionIds: string[]
  public readonly createdAt: Date
  public updatedAt: Date

  constructor(props: RoleProps) {
    this.id = props.id || crypto.randomUUID()
    this.name = props.name
    this.description = props.description
    this.permissionIds = props.permissionIds || []
    this.createdAt = props.createdAt || new Date()
    this.updatedAt = props.updatedAt || new Date()
  }

  update(name: string, description?: string): void {
    this.name = name
    this.description = description
    this.updatedAt = new Date()
  }

  addPermission(permissionId: string): void {
    if (!this.permissionIds.includes(permissionId)) {
      this.permissionIds.push(permissionId)
      this.updatedAt = new Date()
    }
  }

  removePermission(permissionId: string): void {
    const index = this.permissionIds.indexOf(permissionId)
    if (index > -1) {
      this.permissionIds.splice(index, 1)
      this.updatedAt = new Date()
    }
  }

  hasPermission(permissionId: string): boolean {
    return this.permissionIds.includes(permissionId)
  }

  toPersistence() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      permissionIds: this.permissionIds,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    }
  }

  static fromPersistence(data: any): Role {
    return new Role({
      id: data.id,
      name: data.name,
      description: data.description,
      permissionIds: data.permissionIds,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    })
  }
}
