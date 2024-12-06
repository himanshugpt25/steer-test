import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger.js';

/**
 * Global error handling middleware
 * Provides consistent error responses across the application
 * Logs errors for monitoring and auditing (HIPAA requirement)
 * 
 * @param err - Error object
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Next middleware function
 */
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error('Unhandled error:', {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method
  });

  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
};