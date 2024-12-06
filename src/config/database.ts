import mongoose from 'mongoose';
import { logger } from '../utils/logger';

/**
 * Cached database connection instance
 * Used to maintain a single connection across multiple function invocations
 */
let cachedConnection: typeof mongoose | null = null;

/**
 * Establishes or retrieves a connection to MongoDB
 * Implements connection pooling for efficient resource usage
 * 
 * @returns Promise<typeof mongoose> - Mongoose connection instance
 * @throws Error if connection fails
 */
export const getDbConnection = async (): Promise<typeof mongoose> => {
  // Return existing connection if available
  if (cachedConnection) {
    return cachedConnection;
  }

  try {
    // Establish new connection with optimized settings for serverless environment
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/healthcare', {
      serverSelectionTimeoutMS: 5000,  // Fail fast if server selection takes too long
      socketTimeoutMS: 45000,          // Close idle connections after 45 seconds
    });

    // Cache the connection for reuse
    cachedConnection = conn;
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    logger.error('Error connecting to MongoDB:', error);
    throw error;
  }
};