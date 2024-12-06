import { Request, Response } from 'express';
import { UserService } from '../services/userService';
import { ResponseHandler } from '../utils/responseHandler';
import { getDbConnection } from '../config/database';

/**
 * User-related controller methods
 */
export const findOrCreateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    await getDbConnection();
    const user = await UserService.findOrCreateUser(req.body.sessionInfo.parameters);
    
    ResponseHandler.success(
      res,
      { patientId: user.patientId, patientExists: user.policyNumber ? true : false },
      'User retrieved/created successfully',
      200
    );
  } catch (error: any) {
    ResponseHandler.error(res, error,500,{"messages":[{"text":{"text":["User retrieval/creation failed due to some error"]}}]} );
  }
};

export const updateInsurance = async (req: Request, res: Response): Promise<void> => {
  try {
    await getDbConnection();
    const { patientId,insuranceNumber } = req.body.sessionInfo.parameters;
    
    const updatedUser = await UserService.updateInsurance(patientId, insuranceNumber);
    
    ResponseHandler.success(
      res,
      { patientId: updatedUser.patientId, insuranceNumber: updatedUser.policyNumber },
      'Insurance updated successfully'
    );
  } catch (error: any) {
    ResponseHandler.error(
      res,
      error,
      error.message === 'User not found' ? 404 : 
      error.message === 'Policy number already in use' ? 400 : 500,
      {"messages":[{"text":{"text":[error.message]}}]}
    );
  }
};