import { z } from 'zod'

const emailSchema = z.string().email('Invalid email address')

export class Email {
  constructor(public readonly value: string) {
    const result = emailSchema.safeParse(value)
    if (!result.success) {
      throw new Error('Invalid email format')
    }
    this.value = value.toLowerCase().trim()
  }

  toString(): string {
    return this.value
  }

  equals(other: Email): boolean {
    return this.value === other.value
  }
}
