import { Request, Response } from 'express';
import { AppointmentService } from '../services/appointmentService';
import { ResponseHandler } from '../utils/responseHandler';
import { getDbConnection } from '../config/database';

/**
 * Appointment-related controller methods
 */
const createAppointment = async (req: Request, res: Response): Promise<void> => {
  try {
    await getDbConnection();
    const appointment = await AppointmentService.createAppointment(req.body.sessionInfo.parameters);
    
    ResponseHandler.success(
      res,
      {
        bookingId: appointment.bookingId,
        appointmenttime: appointment.appointmentTime
      },
      'Appointment created successfully',
      201,
      {"messages":[{"text":{"text":["Your appointment has been created successfully"]}}]}
    );
  } catch (error: any) {
    ResponseHandler.error(
      res,
      error,
      error.message === 'Patient not found' ? 404 : 500,
      {"messages":[{"text":{"text":["Appointment creation failed due to some error"]}}]}
    );
  }
};

/**
 * Request appointment by checking existing appointments before creating new one
 */
export const requestAppointment = async (req: Request, res: Response): Promise<void> => {
  try {
    await getDbConnection();
    const appointmentData = req.body.sessionInfo.parameters;
    
    // Check if user already has a confirmed appointment
    const existingBooking = await AppointmentService.hasConfirmedAppointment(appointmentData.patientId);
    
    if (existingBooking) {
      ResponseHandler.error(
        res,
        new Error('Appointment already exists'),
        409,
        {"messages":[{"text":{"text":["You already have a confirmed appointment"]}}]},
        {bookingId: existingBooking}
      );
      return;
    }

    // Create new appointment if no existing booking
    const appointment = await AppointmentService.createAppointment(appointmentData);
    
    ResponseHandler.success(
      res,
      {
        bookingId: appointment.bookingId,
        appointmenttime: appointment.appointmentTime
      },
      'Appointment created successfully',
      201,
      {"messages":[{"text":{"text":["Your appointment has been created successfully"]}}]}
    );
  } catch (error: any) {
    ResponseHandler.error(
      res,
      error,
      error.message === 'Patient not found' ? 404 : 500,
      {"messages":[{"text":{"text":["Appointment creation failed due to some error"]}}]}
    );
  }
};
