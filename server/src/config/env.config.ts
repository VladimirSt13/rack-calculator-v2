import dotenv from 'dotenv'

dotenv.config()

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '5000', 10),
  database: {
    url: process.env.DATABASE_URL || 'mongodb://localhost:27017/rack-calculator',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'default-secret',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    refreshSecret: process.env.REFRESH_TOKEN_SECRET || 'default-refresh-secret',
    refreshExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '30d',
  },
  cors: {
    clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
  },
}
