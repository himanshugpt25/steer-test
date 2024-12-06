import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

/**
 * Middleware to log incoming HTTP requests
 * Logs request method, path, and sanitized request body for audit purposes
 * 
 * @param req - Express request object
 * @param res - Express response object 
 * @param next - Next middleware function
 */
export const logRequest = (req: Request, res: Response, next: NextFunction) => {
  // Sanitize sensitive data from request body before logging
  const sanitizedBody = { ...req.body };
  if (sanitizedBody.password) {
    sanitizedBody.password = '[REDACTED]';
  }
  
  logger.info('Incoming request:', {
    method: req.method,
    path: req.path,
    query: req.query,
    body: sanitizedBody,
    ip: req.ip,
    userAgent: req.get('user-agent')
  });

  next();
};
