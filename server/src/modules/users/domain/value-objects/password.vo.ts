import { z } from 'zod'

const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')

export class Password {
  constructor(public readonly value: string) {
    const result = passwordSchema.safeParse(value)
    if (!result.success) {
      throw new Error(result.error.issues[0]?.message || 'Invalid password')
    }
    this.value = value
  }

  async hash(): Promise<string> {
    const encoder = new TextEncoder()
    const data = encoder.encode(this.value)
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
  }

  static async compare(plain: string, hashed: string): Promise<boolean> {
    const password = new Password(plain)
    const hashedPlain = await password.hash()
    return hashedPlain === hashed
  }
}
