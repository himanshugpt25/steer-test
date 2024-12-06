import express from 'express';
import userRoutes from './routes/userRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import { configureServer } from './config/server.js';
import { errorHandler } from './middleware/errorHandler.js';
import { logger } from './utils/logger.js';
import * as dotenv from 'dotenv';

dotenv.config();
/**
 * Creates and configures an Express application
 * Centralizes server setup for both local development and cloud deployment
 * 
 * @returns Configured Express application
 */
const createServer = () => {
  const app = express();

  // Apply server configuration
  configureServer(app);

  // Mount API routes
  app.get('/',(req,res)=>{
    res.send('Hello World');
  });
  app.use('/api', userRoutes);
  app.use('/api', appointmentRoutes);

  // Global error handler
  app.use(errorHandler);

  return app;
};

if (process.env.NODE_ENV === 'development') {
  const app = createServer();
  const port = process.env.PORT || 8080;
  
  app.listen(port,() => {
    logger.info(`Server is running on port ${port}`);
    logger.info(`Environment: ${process.env.NODE_ENV}`);
  });
}

export default createServer;