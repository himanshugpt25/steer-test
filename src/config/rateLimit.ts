import { Options } from 'express-rate-limit';

/**
 * Rate limiting configuration
 * Protects against DoS attacks and ensures service availability
 * Part of HIPAA security compliance measures
 */
export const rateLimitConfig: Partial<Options> = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later',
  standardHeaders: true,
  legacyHeaders: false
};