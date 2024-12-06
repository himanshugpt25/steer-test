import { Response } from 'express';
import { ApiResponse } from '../types';
import { logger } from './logger';

/**
 * Utility class to handle API responses consistently
 */
export class ResponseHandler {
  /**
   * Send a success response
   */
  static success<T>(res: Response, data: T, message?: string, status = 200,fulfillmentResponse?: any): void {
    const response: ApiResponse<T> = {
      success: true,
      sessionInfo: {
        parameters: {...data,isError:false}
      },
      ...(fulfillmentResponse && {fulfillmentResponse}),
      message
    };
    logger.info(`Response: ${JSON.stringify(response)}`);
    res.status(status).json(response);
  }

  /**
   * Send an error response
   */
  static error(res: Response, error: string | Error, status = 200,fulfillmentResponse?: any,data?:any): void {
    const errorMessage = error instanceof Error ? error.message : error;
    logger.error(errorMessage);
    
    const response: ApiResponse = {
      success: false,
      error: errorMessage,
      sessionInfo: {
        parameters: data ? {isError:true, ...data} : {isError:true}
      },
      ...(fulfillmentResponse && {fulfillmentResponse}),
    };
    logger.error(`Response: ${JSON.stringify(response)}`);
    res.status(200).json(response);
  }
}