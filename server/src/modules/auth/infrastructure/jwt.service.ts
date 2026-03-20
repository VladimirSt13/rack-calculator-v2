import jwt, { SignOptions } from 'jsonwebtoken'
import { StringValue } from 'ms'
import { config } from '../../../config/env.config.js'

export interface TokenPayload {
  userId: string
  email: string
  role: string
}

export interface Tokens {
  accessToken: string
  refreshToken: string
}

export class JwtService {
  static generateAccessToken(payload: TokenPayload): string {
    const options: SignOptions = { expiresIn: config.jwt.expiresIn as StringValue }
    return jwt.sign(payload, config.jwt.secret, options)
  }

  static generateRefreshToken(payload: TokenPayload): string {
    const options: SignOptions = { expiresIn: config.jwt.refreshExpiresIn as StringValue }
    return jwt.sign(payload, config.jwt.refreshSecret, options)
  }

  static verifyAccessToken(token: string): TokenPayload {
    return jwt.verify(token, config.jwt.secret) as TokenPayload
  }

  static verifyRefreshToken(token: string): TokenPayload {
    return jwt.verify(token, config.jwt.refreshSecret) as TokenPayload
  }

  static decodeToken(token: string): TokenPayload | null {
    try {
      return jwt.decode(token) as TokenPayload
    } catch {
      return null
    }
  }
}
