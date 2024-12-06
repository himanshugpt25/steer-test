import mongoose, { Document, Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

/**
 * Interface representing an Appointment document in MongoDB
 * Extends the base Document type from Mongoose with custom fields
 * Used for type safety and autocomplete in TypeScript
 */
export interface IAppointment extends Document {
  bookingId: string;    // Unique identifier for the appointment
  patientId: string;    // Reference to the patient's ID
  appointmentType: string;  // Type of appointment (e.g., consultation, followup)
  appointmentTime: Date; // Scheduled time of the appointment
  additionalInfo?: string; // Optional notes or additional information
  status: 'confirmed' | 'completed' | 'cancelled'; // Current status of the appointment
  createdAt: Date;      // Timestamp of booking creation
  updatedAt: Date;      // Timestamp of last update
}

/**
 * Mongoose schema definition for the Appointment model
 * Includes field definitions, validations, and relationships
 */
const AppointmentSchema = new Schema({
  bookingId: {
    type: String,
    required: true,
    unique: true,
    default: () => uuidv4()  // Automatically generate UUID for new appointments
  },
  patientId: {
    type: String,
    required: true,
    ref: 'User'              // Reference to User model for population
  },
  appointmentType: {
    type: String,
    required: true
  },
  appointmentTime: {
    type: Date,
    required: true
  },
  additionalInfo: {
    type: String
  },
  status: {
    type: String,
    enum: ['confirmed', 'completed', 'cancelled'],  // Restrict to valid status values
    default: 'confirmed'
  }
}, {
  timestamps: true  // Automatically manage createdAt and updatedAt fields
});

// Create and export the Appointment model
export const Appointment = mongoose.model<IAppointment>('Appointment', AppointmentSchema);