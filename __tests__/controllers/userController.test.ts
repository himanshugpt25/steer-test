import { Request, Response } from 'express';
import { findOrCreateUser, updateInsurance } from '../../src/controllers/userController';
import { UserService } from '../../src/services/userService';
import { ResponseHandler } from '../../src/utils/responseHandler';
import { getDbConnection } from '../../src/config/database';

// Mock dependencies
jest.mock('../../src/services/userService');
jest.mock('../../src/utils/responseHandler');
jest.mock('../../src/config/database');

describe('findOrCreateUser', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockRequest = {
      body: {
        sessionInfo: {
          parameters: {
            firstName: 'John',
            lastName: 'Doe',
            birthDate: {
              day: 1,
              month: 1,
              year: 1990
            }
          }
        }
      }
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    jest.clearAllMocks();
  });

  describe('findOrCreateUser', () => {
    it('should successfully find or create a user and return success response', async () => {
      const mockUser = {
        firstName: 'John',
        lastName: 'Doe',
        birthDate: '1990-01-01T00:00:00.000Z',
        patientId: 'mockUserId'
      };

      (getDbConnection as jest.Mock).mockResolvedValue(undefined);
      (UserService.findOrCreateUser as jest.Mock).mockResolvedValue(mockUser);

      await findOrCreateUser(mockRequest as Request, mockResponse as Response);

      expect(getDbConnection).toHaveBeenCalled();
      expect(UserService.findOrCreateUser).toHaveBeenCalledWith(mockRequest.body.sessionInfo.parameters);
      expect(ResponseHandler.success).toHaveBeenCalledWith(
        mockResponse,
        { patientId: mockUser.patientId, patientExists: false },
        'User retrieved/created successfully',
        200
      );
    });

    it('should handle errors and return error response', async () => {
      const error = new Error('Database error');
      
      (getDbConnection as jest.Mock).mockRejectedValue(error);

      await findOrCreateUser(mockRequest as Request, mockResponse as Response);

      expect(ResponseHandler.error).toHaveBeenCalledWith(
        mockResponse,
        error,
        500,
        {"messages":[{"text":{"text":["User retrieval/creation failed due to some error"]}}]}
      );
    });

    it('should handle missing parameters in request', async () => {
      mockRequest.body = {};

      await findOrCreateUser(mockRequest as Request, mockResponse as Response);

      expect(ResponseHandler.error).toHaveBeenCalledWith(
        mockResponse,
        expect.any(Error),
        500,
        {"messages":[{"text":{"text":["User retrieval/creation failed due to some error"]}}]}
      );
    });
  });
});

describe('updateInsurance', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockRequest = {
      body: {
        sessionInfo: {
          parameters: {
            patientId: 'testPatientId',
            insuranceNumber: 'INS123'
          }
        }
      }
    };

    mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };

    jest.clearAllMocks();
  });

  it('should successfully update insurance and return success response', async () => {
    const mockUpdatedUser = {
      patientId: 'testPatientId',
      policyNumber: 'INS123',
      _id: 'mockUserId'
    };

    (getDbConnection as jest.Mock).mockResolvedValue(undefined);
    (UserService.updateInsurance as jest.Mock).mockResolvedValue(mockUpdatedUser);

    await updateInsurance(mockRequest as Request, mockResponse as Response);

    expect(getDbConnection).toHaveBeenCalled();
    expect(UserService.updateInsurance).toHaveBeenCalledWith(
      mockRequest.body.sessionInfo.parameters.patientId,
      mockRequest.body.sessionInfo.parameters.insuranceNumber
    );
    expect(ResponseHandler.success).toHaveBeenCalledWith(
      mockResponse,
      { patientId: mockUpdatedUser.patientId, insuranceNumber: mockUpdatedUser.policyNumber },
      'Insurance updated successfully'
    );
  });

  it('should handle user not found error', async () => {
    const error = new Error('User not found');
    
    (getDbConnection as jest.Mock).mockResolvedValue(undefined);
    (UserService.updateInsurance as jest.Mock).mockRejectedValue(error);

    await updateInsurance(mockRequest as Request, mockResponse as Response);

    expect(ResponseHandler.error).toHaveBeenCalledWith(
      mockResponse,
      expect.objectContaining({ message: 'User not found' }),
      404,
      {"messages":[{"text":{"text":["User not found"]}}]}
    );
  });

  it('should handle duplicate policy number error', async () => {
    const error = new Error('Policy number already in use');
    
    (getDbConnection as jest.Mock).mockResolvedValue(undefined);
    (UserService.updateInsurance as jest.Mock).mockRejectedValue(error);

    await updateInsurance(mockRequest as Request, mockResponse as Response);

    expect(ResponseHandler.error).toHaveBeenCalledWith(
      mockResponse,
      error,
      400,
      {"messages":[{"text":{"text":["Policy number already in use"]}}]}
    );
  });

  it('should handle general errors', async () => {
    const error = new Error('Database error');
    
    (getDbConnection as jest.Mock).mockRejectedValue(error);

    await updateInsurance(mockRequest as Request, mockResponse as Response);

    expect(ResponseHandler.error).toHaveBeenCalledWith(
      mockResponse,
      error,
      500,
      {"messages":[{"text":{"text":["Database error"]}}]}
    );
  });

  it('should handle missing parameters in request', async () => {
    mockRequest.body = {};

    await updateInsurance(mockRequest as Request, mockResponse as Response);

    expect(ResponseHandler.error).toHaveBeenCalledWith(
      mockResponse,
      expect.any(Error),
      500,
      {"messages":[{"text":{"text":["Database error"]}}]}
    );
  });
});

