import nodemailer from 'nodemailer'
import { config } from '../../config/env.config.js'

export interface EmailOptions {
  to: string
  subject: string
  html: string
  text?: string
}

export class EmailService {
  private transporter: nodemailer.Transporter

  constructor() {
    // Создаём транспортер для SMTP
    this.transporter = nodemailer.createTransport({
      host: config.email?.smtpHost || 'smtp.gmail.com',
      port: config.email?.smtpPort || 587,
      secure: config.email?.smtpSecure || false,
      auth: {
        user: config.email?.smtpUser,
        pass: config.email?.smtpPassword,
      },
    })
  }

  /**
   * Отправка email
   */
  async sendEmail(options: EmailOptions): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: `"${config.email?.fromName || 'Rack Calculator'}" <${config.email?.fromEmail || 'noreply@example.com'}>`,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
      })

      console.log(`✅ Email sent to: ${options.to}`)
    } catch (error) {
      console.error('❌ Email send error:', error)
      throw new Error(`Failed to send email: ${error}`)
    }
  }

  /**
   * Отправка email верификации
   */
  async sendVerificationEmail(email: string, verifyToken: string, userId: string): Promise<void> {
    const verifyUrl = `${config.cors.clientUrl}/verify-email?token=${verifyToken}&id=${userId}`

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #1e40af; color: white; padding: 20px; text-align: center; }
            .button { display: inline-block; background: #1e40af; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { background: #f4f4f4; padding: 20px; text-align: center; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Подтверждение Email</h1>
            </div>
            <div class="content">
              <p>Здравствуйте!</p>
              <p>Спасибо за регистрацию в Rack Calculator. Пожалуйста, подтвердите ваш email адрес.</p>
              <p style="text-align: center;">
                <a href="${verifyUrl}" class="button">Подтвердить Email</a>
              </p>
              <p>Или скопируйте эту ссылку в браузер:</p>
              <p style="word-break: break-all; color: #1e40af;">${verifyUrl}</p>
              <p>Ссылка действительна в течение 24 часов.</p>
            </div>
            <div class="footer">
              <p>© 2026 Rack Calculator. Все права защищены.</p>
              <p>Если вы не регистрировались, просто проигнорируйте это письмо.</p>
            </div>
          </div>
        </body>
      </html>
    `

    const text = `
      Подтверждение Email
      
      Здравствуйте!
      
      Спасибо за регистрацию в Rack Calculator.
      
      Подтвердите ваш email: ${verifyUrl}
      
      Ссылка действительна в течение 24 часов.
      
      © 2026 Rack Calculator
    `

    await this.sendEmail({
      to: email,
      subject: '🎉 Подтверждение Email - Rack Calculator',
      html,
      text,
    })
  }

  /**
   * Отправка email сброса пароля
   */
  async sendResetPasswordEmail(email: string, resetToken: string, userId: string): Promise<void> {
    const resetUrl = `${config.cors.clientUrl}/reset-password?token=${resetToken}&id=${userId}`

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #dc2626; color: white; padding: 20px; text-align: center; }
            .button { display: inline-block; background: #dc2626; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .warning { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; }
            .footer { background: #f4f4f4; padding: 20px; text-align: center; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔐 Сброс Пароля</h1>
            </div>
            <div class="content">
              <p>Здравствуйте!</p>
              <p>Вы запросили сброс пароля для вашего аккаунта Rack Calculator.</p>
              <p style="text-align: center;">
                <a href="${resetUrl}" class="button">Сбросить Пароль</a>
              </p>
              <p>Или скопируйте эту ссылку в браузер:</p>
              <p style="word-break: break-all; color: #dc2626;">${resetUrl}</p>
              <div class="warning">
                <strong>⚠️ Важно:</strong> Если вы не запрашивали сброс пароля, просто проигнорируйте это письмо. Ваш пароль останется без изменений.
              </div>
              <p>Ссылка действительна в течение 1 часа.</p>
            </div>
            <div class="footer">
              <p>© 2026 Rack Calculator. Все права защищены.</p>
            </div>
          </div>
        </body>
      </html>
    `

    const text = `
      Сброс Пароля
      
      Здравствуйте!
      
      Вы запросили сброс пароля для вашего аккаунта Rack Calculator.
      
      Сбросить пароль: ${resetUrl}
      
      ⚠️ Если вы не запрашивали сброс пароля, просто проигнорируйте это письмо.
      
      Ссылка действительна в течение 1 часа.
      
      © 2026 Rack Calculator
    `

    await this.sendEmail({
      to: email,
      subject: '🔐 Сброс Пароля - Rack Calculator',
      html,
      text,
    })
  }
}

// Экспорт singleton экземпляра
export const emailService = new EmailService()
