/**
 * Value Object representing a permission identifier
 * Format: "resource:action" (e.g., "users:create", "rack:read")
 */
export class PermissionIdentifier {
  public readonly resource: string
  public readonly action: string
  public readonly value: string

  constructor(resource: string, action: string) {
    this.resource = resource.toLowerCase()
    this.action = action.toLowerCase()
    this.value = `${this.resource}:${this.action}`
  }

  toString(): string {
    return this.value
  }

  equals(other: PermissionIdentifier): boolean {
    return this.value === other.value
  }

  static fromString(value: string): PermissionIdentifier {
    const [resource, action] = value.split(':')
    if (!resource || !action) {
      throw new Error(`Invalid permission identifier: ${value}`)
    }
    return new PermissionIdentifier(resource, action)
  }
}
