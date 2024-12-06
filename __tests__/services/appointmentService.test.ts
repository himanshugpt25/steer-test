import { AppointmentService } from '../../src/services/appointmentService';
import { Patients } from '../../src/models/Patient';
import { Appointment } from '../../src/models/Appointment';
import { formatAppointmentTime } from '../../src/utils/formatInputs';
import { AppointmentType } from '../../src/types';

// Mock the dependencies
jest.mock('../../src/models/Patient');
jest.mock('../../src/models/Appointment');
jest.mock('../../src/utils/formatInputs');

describe('AppointmentService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createAppointment', () => {
    const mockAppointmentData = {
      patientId: '123',
      appointmentType: 'consultation' as const,
      appointmentTime: {
        year: 2023,
        month: 12,
        day: 25,
        hours: 14,
        minutes: 30
      },
      additionalInfo: 'First visit',
      status: 'confirmed' as const
    };

    const mockFormattedTime = '2023-12-25T14:30:00.000Z';

    beforeEach(() => {
      (formatAppointmentTime as jest.Mock).mockReturnValue(mockFormattedTime);
    });

    it('should throw error if patient is not found', async () => {
      (Patients.findOne as jest.Mock).mockResolvedValue(null);

      await expect(AppointmentService.createAppointment(mockAppointmentData))
        .rejects
        .toThrow('Patient not found');

      expect(Patients.findOne).toHaveBeenCalledWith({ patientId: mockAppointmentData.patientId });
      expect(Appointment.create).not.toHaveBeenCalled();
    });

    it('should create appointment if patient exists', async () => {
      const mockUser = { patientId: mockAppointmentData.patientId };
      const mockCreatedAppointment = {
        ...mockAppointmentData,
        appointmentTime: mockFormattedTime
      };

      (Patients.findOne as jest.Mock).mockResolvedValue(mockUser);
      (Appointment.create as jest.Mock).mockResolvedValue(mockCreatedAppointment);

      const result = await AppointmentService.createAppointment(mockAppointmentData);

        expect(Patients.findOne).toHaveBeenCalledWith({ patientId: mockAppointmentData.patientId });
      expect(Appointment.create).toHaveBeenCalledWith({
        ...mockAppointmentData,
        appointmentTime: mockFormattedTime,
        appointmentType: mockAppointmentData.appointmentType,
        status: 'confirmed'
      });
      expect(result).toEqual(mockCreatedAppointment);
    });
  });

  describe('hasConfirmedAppointment', () => {
    const patientId = '123';

    it('should return booking ID if confirmed appointment exists', async () => {
      const mockAppointment = {
        bookingId: 'booking123'
      };
      (Appointment.findOne as jest.Mock).mockResolvedValue(mockAppointment);

      const result = await AppointmentService.hasConfirmedAppointment(patientId);

      expect(Appointment.findOne).toHaveBeenCalledWith({
        patientId,
        status: 'confirmed'
      });
      expect(result).toBe('booking123');
    });

    it('should return null if no confirmed appointment exists', async () => {
      (Appointment.findOne as jest.Mock).mockResolvedValue(null);

      const result = await AppointmentService.hasConfirmedAppointment(patientId);

      expect(Appointment.findOne).toHaveBeenCalledWith({
        patientId,
        status: 'confirmed'
      });
      expect(result).toBeNull();
    });
  });
});
