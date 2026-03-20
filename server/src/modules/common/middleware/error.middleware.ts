import { Request, Response, NextFunction } from 'express'
import { AppError } from '../errors/app.error.js'

export const errorMiddleware = (
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error(err)

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
      },
    })
  }

  return res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: 'Internal server error',
    },
  })
}
