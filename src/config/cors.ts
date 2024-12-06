import { CorsOptions } from 'cors';

/**
 * CORS configuration options
 * Defines allowed origins, methods, and headers for cross-origin requests
 * Critical for HIPAA compliance by restricting access to trusted sources
 */
export const corsOptions: CorsOptions = {
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400 // 24 hours
};