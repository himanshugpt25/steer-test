import { formatDateInput } from '../utils/formatInputs';
import { Patients } from '../models/Patient';
import { UserData } from '../types';
import { logger } from '../utils/logger';

/**
 * Service layer for handling user-related business logic
 */
export class UserService {
  /**
   * Find or create a user based on their details
   */
  static async findOrCreateUser(userData: UserData) {
    const { firstName, lastName, birthDate } = userData;

    const existingUser = await Patients.findOne({
      firstName,
      lastName,
      birthDate: formatDateInput(birthDate)
    });

    if (existingUser) {
      return existingUser;
    }

    return Patients.create({
      firstName,
      lastName,
      birthDate: formatDateInput(birthDate)
    });
  }

  /**
   * Update user's insurance policy
   */
  static async updateInsurance(patientId: string, policyNumber: string) {
    const existingUserWithPolicy = await Patients.findOne({
      policyNumber,
      patientId: { $ne: patientId }
    });

    if (existingUserWithPolicy) {
      throw new Error('Policy number already in use', { cause: 500 });
    }

    const updatedUser = await Patients.findOneAndUpdate(
      { patientId },
      { policyNumber },
      { new: true }
    );

    if (!updatedUser) {
      throw new Error('User not found');
    }

    return updatedUser;
  }
}