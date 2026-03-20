import express from 'express'
import { config } from './config/env.config.js'
import { errorMiddleware } from './modules/common/middleware/error.middleware.js'
import { registerRoutes } from './routes.js'

const app = express()

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', config.cors.clientUrl)
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200)
  }
  next()
  return undefined
})

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Register routes
registerRoutes(app)

// API info
app.get('/api', (_req, res) => {
  res.json({ message: 'Rack Calculator API v1' })
})

// Error handling
app.use(errorMiddleware)

// Start server
app.listen(config.port, () => {
  console.log(`🚀 Server running on http://localhost:${config.port}`)
  console.log(`📝 Environment: ${config.env}`)
})
