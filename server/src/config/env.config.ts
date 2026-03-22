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
  email: {
    smtpHost: process.env.SMTP_HOST || 'smtp.gmail.com',
    smtpPort: parseInt(process.env.SMTP_PORT || '587', 10),
    smtpSecure: process.env.SMTP_SECURE === 'true',
    smtpUser: process.env.SMTP_USER,
    smtpPassword: process.env.SMTP_PASSWORD,
    fromEmail: process.env.EMAIL_FROM || 'noreply@example.com',
    fromName: process.env.EMAIL_FROM_NAME || 'Rack Calculator',
  },
}
