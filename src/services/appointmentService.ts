import { formatAppointmentTime } from '../utils/formatInputs';
import { Appointment } from '../models/Appointment';
import { Patients } from '../models/Patient';
import { AppointmentData } from '../types';

/**
 * Service layer for handling appointment-related business logic
 */
export class AppointmentService {
  /**
   * Create a new appointment booking
   */
  static async createAppointment(appointmentData: AppointmentData) {
    const { patientId } = appointmentData;

    const user = await Patients.findOne({ patientId });
    if (!user) {
      throw new Error('Patient not found');
    }

    const { bookingId, ...appointmentDataWithoutBookingId } = appointmentData;
    const appointment = await Appointment.create({
      ...appointmentDataWithoutBookingId,
      appointmentTime: formatAppointmentTime(appointmentData.appointmentTime),
      appointmentType: appointmentData.appointmentType,
      status: 'confirmed'
    });

    return appointment;
  }

  /**
   * Check if patient has any confirmed appointments
   * @param patientId The ID of the patient to check
   * @returns The booking ID of the confirmed appointment if it exists, null otherwise
   */
  static async hasConfirmedAppointment(patientId: string): Promise<string | null> {
    const existingAppointment = await Appointment.findOne({
      patientId,
      status: 'confirmed'
    });

    return existingAppointment ? existingAppointment.bookingId : null;
  }
}