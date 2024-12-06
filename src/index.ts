// import { http } from '@google-cloud/functions-framework';
import {https} from 'firebase-functions/v2';
import createServer from './server.js';
import * as dotenv from 'dotenv';
import { logger } from './utils/logger.js';

dotenv.config();

/**
 * Entry point for Google Cloud Functions
 * Exports the Express application as a Cloud Function
 * Uses the same server configuration as local development
 */
const app = createServer();
// app.listen(process.env.PORT || 8080,()=>{
//   logger.info(`Server is running on port ${process.env.PORT || 8080}`);
// });
https.onRequest(app);

export { app as steerappointmentbot };