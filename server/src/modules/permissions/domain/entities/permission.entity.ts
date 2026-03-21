export interface PermissionProps {
  id?: string
  name: string
  resource: string
  action: string
  createdAt?: Date
  updatedAt?: Date
}

export class Permission {
  public readonly id: string
  public name: string
  public resource: string
  public action: string
  public readonly createdAt: Date
  public updatedAt: Date

  constructor(props: PermissionProps) {
    this.id = props.id || crypto.randomUUID()
    this.name = props.name
    this.resource = props.resource
    this.action = props.action
    this.createdAt = props.createdAt || new Date()
    this.updatedAt = props.updatedAt || new Date()
  }

  /**
   * Creates a permission identifier string
   * e.g., "users:create", "rack:read", "battery:delete"
   */
  getIdentifier(): string {
    return `${this.resource}:${this.action}`
  }

  update(name: string, resource: string, action: string): void {
    this.name = name
    this.resource = resource
    this.action = action
    this.updatedAt = new Date()
  }

  toPersistence() {
    return {
      id: this.id,
      name: this.name,
      resource: this.resource,
      action: this.action,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    }
  }

  static fromPersistence(data: any): Permission {
    return new Permission({
      id: data.id,
      name: data.name,
      resource: data.resource,
      action: data.action,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    })
  }
}
