import { Request, Response } from 'express';
import { requestAppointment } from '../../src/controllers/appointmentController';
import { AppointmentService } from '../../src/services/appointmentService';
import { ResponseHandler } from '../../src/utils/responseHandler';
import { getDbConnection } from '../../src/config/database';

// Mock dependencies
jest.mock('../../src/services/appointmentService');
jest.mock('../../src/utils/responseHandler');
jest.mock('../../src/config/database');

describe('requestAppointment', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockRequest = {
      body: {
        sessionInfo: {
          parameters: {
            patientId: 'testPatientId',
            appointmentTime: '2023-12-01T10:00:00Z'
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

  it('should successfully create an appointment when no existing booking', async () => {
    const mockAppointment = {
      bookingId: 'testBookingId',
      appointmentTime: '2023-12-01T10:00:00Z'
    };

    (getDbConnection as jest.Mock).mockResolvedValue(undefined);
    (AppointmentService.hasConfirmedAppointment as jest.Mock).mockResolvedValue(false);
    (AppointmentService.createAppointment as jest.Mock).mockResolvedValue(mockAppointment);

    await requestAppointment(mockRequest as Request, mockResponse as Response);

    expect(getDbConnection).toHaveBeenCalled();
    expect(AppointmentService.hasConfirmedAppointment).toHaveBeenCalledWith('testPatientId');
    expect(AppointmentService.createAppointment).toHaveBeenCalledWith(mockRequest.body.sessionInfo.parameters);
    expect(ResponseHandler.success).toHaveBeenCalledWith(
      mockResponse,
      {
        bookingId: mockAppointment.bookingId,
        appointmenttime: mockAppointment.appointmentTime
      },
      'Appointment created successfully',
      201,
      {"messages":[{"text":{"text":["Your appointment has been created successfully"]}}]}
    );
  });

  it('should return error when user already has confirmed appointment', async () => {
    (getDbConnection as jest.Mock).mockResolvedValue(undefined);
    (AppointmentService.hasConfirmedAppointment as jest.Mock).mockResolvedValue(true);

    await requestAppointment(mockRequest as Request, mockResponse as Response);

    expect(ResponseHandler.error).toHaveBeenCalledWith(
      mockResponse,
      expect.any(Error),
      409,
      {"messages":[{"text":{"text":["You already have a confirmed appointment"]}}]},
      {bookingId: true}
    );
    expect(AppointmentService.createAppointment).not.toHaveBeenCalled();
  });

  it('should handle patient not found error', async () => {
    const error = new Error('Patient not found');
    
    (getDbConnection as jest.Mock).mockResolvedValue(undefined);
    (AppointmentService.hasConfirmedAppointment as jest.Mock).mockResolvedValue(false);
    (AppointmentService.createAppointment as jest.Mock).mockRejectedValue(error);

    await requestAppointment(mockRequest as Request, mockResponse as Response);

    expect(ResponseHandler.error).toHaveBeenCalledWith(
      mockResponse,
      error,
      404,
      {"messages":[{"text":{"text":["Appointment creation failed due to some error"]}}]}
    );
  });

  it('should handle general errors', async () => {
    const error = new Error('Database error');
    
    (getDbConnection as jest.Mock).mockRejectedValue(error);

    await requestAppointment(mockRequest as Request, mockResponse as Response);

    expect(ResponseHandler.error).toHaveBeenCalledWith(
      mockResponse,
      error,
      500,
      {"messages":[{"text":{"text":["Appointment creation failed due to some error"]}}]}
    );
  });

  it('should handle missing parameters in request', async () => {
    mockRequest.body = {};

    await requestAppointment(mockRequest as Request, mockResponse as Response);

    expect(ResponseHandler.error).toHaveBeenCalledWith(
      mockResponse,
      expect.any(Error),
      500,
      {"messages":[{"text":{"text":["Appointment creation failed due to some error"]}}]}
    );
  });
});
