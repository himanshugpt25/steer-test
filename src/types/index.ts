/**
 * Common type definitions used across the application
 */

// User related types
export interface UserData {
  firstName: string;
  lastName: string;
  birthDate: {day:number,month:number,year:number};
  policyNumber?: string;
}

// Appointment related types
export interface AppointmentData {
  bookingId?: string;
  patientId: string;
  appointmentType: AppointmentType;
  appointmentTime: {year:number,month:number,day:number,hours:number,minutes:number};
  additionalInfo?: string;
  status: AppointmentStatus;
}

export type AppointmentType = 'consultation' | 'followup' | 'emergency' | 'routine';
export type AppointmentStatus = 'confirmed' | 'cancelled' | 'completed';
// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  sessionInfo: {
    parameters: T;
  };
  fulfillmentResponse?: any;
  error?: string;
  message?: string;
}