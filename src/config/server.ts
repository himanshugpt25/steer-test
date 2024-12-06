import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { corsOptions } from './cors.js';
import { rateLimitConfig } from './rateLimit.js';

/**
 * Configures and applies middleware to the Express application
 * Centralizes server configuration for consistent setup across environments
 * 
 * @param app - Express application instance
 * @returns Configured Express application
 */
export const configureServer = (app: express.Application): express.Application => {
  // Security middleware
  app.use(helmet());
  app.use(cors(corsOptions));
  app.set('trust proxy', true);
  // app.use(rateLimit(rateLimitConfig));

  // Body parsing middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  return app;
};