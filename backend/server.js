import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { airQualityRouter } from './routes/air-quality.js';
import logger from './utils/logger.js';
import { apiLimiter } from './utils/rate-limiter.js';
import fs from 'fs';

// Get current file directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env file from backend directory
dotenv.config({ path: join(__dirname, '.env') });

// Ensure logs directory exists (some hosts don't create it for us)
try {
  const logsDir = join(__dirname, 'logs');
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
    logger.info('Created logs directory');
  }
} catch (e) {
  // If logger not available yet, fallback to console
  try { logger.warn('Could not create logs directory', e); } catch (_) { console.warn('Could not create logs directory', e); }
}

// Log environment check
logger.info('🔧 Environment Check:');
logger.info(`   OPENWEATHER_API_KEY: ${process.env.OPENWEATHER_API_KEY ? '✅ Set' : '❌ Not set'}`);
logger.info(`   WAQI_API_KEY: ${process.env.WAQI_API_KEY ? '✅ Set' : '❌ Not set'}`);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Apply rate limiter to all routes
app.use(apiLimiter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Nepal Air Watch Backend is running' });
});

// API Routes
app.use('/api', airQualityRouter);

// Global error handler
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  // In production, you might want to gracefully shutdown
  if (process.env.NODE_ENV === 'production') {
    process.exit(1);
  }
});

process.on('unhandledRejection', (error) => {
  logger.error('Unhandled Promise Rejection:', error);
});

// Start server
const server = app.listen(PORT, () => {
  logger.info(`🚀 Server running on http://localhost:${PORT}`);
  logger.info(`📍 API endpoint: http://localhost:${PORT}/api/air-quality`);
  logger.info(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
});

