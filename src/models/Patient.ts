import mongoose, { Document, Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

/**
 * Interface representing a Patients document in MongoDB
 * Extends the base Document type from Mongoose with custom fields
 * Used for type safety and autocomplete in TypeScript
 */
export interface IPatients extends Document {
  patientId: string;      // Unique identifier for the patient
  firstName: string;      // Patient's first name
  lastName: string;       // Patient's last name
  birthDate: Date;      // Patient's date of birth
  policyNumber?: string;  // Optional insurance policy number
  createdAt: Date;        // Timestamp of record creation
  updatedAt: Date;        // Timestamp of last update
}

/**
 * Mongoose schema definition for the Patients model
 * Includes field definitions, validations, and indexes
 */
const PatientsSchema = new Schema({
  patientId: {
    type: String,
    required: true,
    unique: true,
    default: () => uuidv4()  // Automatically generate UUID for new patients
  },
  firstName: {
    type: String,
    required: true,
    trim: true              // Remove whitespace from both ends
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  birthDate: {
    type: Date,
    required: true
  },
  policyNumber: {
    type: String,
    sparse: true,           // Sparse index allows null values
    unique: true            // Ensure policy numbers are unique when present
  }
}, {
  timestamps: true          // Automatically manage createdAt and updatedAt fields
});

// Create and export the Patients model
export const Patients = mongoose.model<IPatients>('Patients', PatientsSchema);
