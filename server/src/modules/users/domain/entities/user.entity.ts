import { Email } from '../value-objects/email.vo.js'

export type UserRole = 'USER' | 'ADMIN'

export interface UserProps {
  id?: string
  email: Email
  passwordHash: string
  firstName?: string
  lastName?: string
  role: UserRole
  emailVerified: boolean
  emailVerifiedAt?: Date
  refreshToken?: string
  resetToken?: string
  resetTokenExpiry?: Date
  createdAt?: Date
  updatedAt?: Date
}

export class User {
  public readonly id: string
  public email: Email
  public passwordHash: string
  public firstName?: string
  public lastName?: string
  public role: UserRole
  public emailVerified: boolean
  public emailVerifiedAt?: Date
  public refreshToken?: string
  public resetToken?: string
  public resetTokenExpiry?: Date
  public readonly createdAt: Date
  public updatedAt: Date

  constructor(props: UserProps) {
    this.id = props.id || crypto.randomUUID()
    this.email = props.email
    this.passwordHash = props.passwordHash
    this.firstName = props.firstName
    this.lastName = props.lastName
    this.role = props.role
    this.emailVerified = props.emailVerified
    this.emailVerifiedAt = props.emailVerifiedAt
    this.refreshToken = props.refreshToken
    this.resetToken = props.resetToken
    this.resetTokenExpiry = props.resetTokenExpiry
    this.createdAt = props.createdAt || new Date()
    this.updatedAt = props.updatedAt || new Date()
  }

  updateProfile(firstName?: string, lastName?: string): void {
    this.firstName = firstName
    this.lastName = lastName
    this.updatedAt = new Date()
  }

  verifyEmail(): void {
    this.emailVerified = true
    this.emailVerifiedAt = new Date()
    this.updatedAt = new Date()
  }

  updatePassword(passwordHash: string): void {
    this.passwordHash = passwordHash
    this.updatedAt = new Date()
  }

  setRefreshToken(token: string | null): void {
    this.refreshToken = token ?? undefined
    this.updatedAt = new Date()
  }

  setResetToken(token: string | null, expiry: Date | null): void {
    this.resetToken = token ?? undefined
    this.resetTokenExpiry = expiry ?? undefined
    this.updatedAt = new Date()
  }

  toPersistence() {
    return {
      id: this.id,
      email: this.email.toString(),
      password: this.passwordHash,
      firstName: this.firstName,
      lastName: this.lastName,
      role: this.role,
      emailVerified: this.emailVerified,
      emailVerifiedAt: this.emailVerifiedAt,
      refreshToken: this.refreshToken,
      resetToken: this.resetToken,
      resetTokenExpiry: this.resetTokenExpiry,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    }
  }

  static fromPersistence(data: any): User {
    return new User({
      id: data.id,
      email: new Email(data.email),
      passwordHash: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
      role: data.role,
      emailVerified: data.emailVerified,
      emailVerifiedAt: data.emailVerifiedAt,
      refreshToken: data.refreshToken,
      resetToken: data.resetToken,
      resetTokenExpiry: data.resetTokenExpiry,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    })
  }
}
