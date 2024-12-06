import { UserService } from '../../src/services/userService';
import { Patients } from '../../src/models/Patient';
import { formatDateInput } from '../../src/utils/formatInputs';

// Mock the User model and formatDateInput utility
jest.mock('../../src/models/Patient');
jest.mock('../../src/utils/formatInputs');

describe('UserService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('findOrCreateUser', () => {
    const mockUserData = {
      firstName: 'John',
      lastName: 'Doe',
      birthDate: {
        day: 1,
        month: 1,
        year: 1990
      }
    };

    const mockFormattedDate = '1990-01-01T00:00:00.000Z';

    beforeEach(() => {
      (formatDateInput as jest.Mock).mockReturnValue(mockFormattedDate);
    });

    it('should return existing user if found', async () => {
      const mockUser = { ...mockUserData, birthDate: mockFormattedDate };
      (Patients.findOne as jest.Mock).mockResolvedValue(mockUser);

      const result = await UserService.findOrCreateUser(mockUserData);

      expect(Patients.findOne).toHaveBeenCalledWith({
        firstName: mockUserData.firstName,
        lastName: mockUserData.lastName,
        birthDate: mockFormattedDate
      });
      expect(Patients.create).not.toHaveBeenCalled();
      expect(result).toEqual(mockUser);
    });

    it('should create new user if not found', async () => {
      const mockUser = { ...mockUserData, birthDate: mockFormattedDate };
      (Patients.findOne as jest.Mock).mockResolvedValue(null);
      (Patients.create as jest.Mock).mockResolvedValue(mockUser);

      const result = await UserService.findOrCreateUser(mockUserData);

      expect(Patients.findOne).toHaveBeenCalled();
      expect(Patients.create).toHaveBeenCalledWith({
        firstName: mockUserData.firstName,
        lastName: mockUserData.lastName,
        birthDate: mockFormattedDate
      });
      expect(result).toEqual(mockUser);
    });
  });

  describe('updateInsurance', () => {
    const mockPatientId = '123';
    const mockPolicyNumber = 'POL123';

    it('should throw error if policy number is already in use', async () => {
      (Patients.findOne as jest.Mock).mockResolvedValue({ patientId: '456' });

      await expect(UserService.updateInsurance(mockPatientId, mockPolicyNumber))
        .rejects
        .toThrow('Policy number already in use');

      expect(Patients.findOne).toHaveBeenCalledWith({
        policyNumber: mockPolicyNumber,
        patientId: { $ne: mockPatientId }
      });
      expect(Patients.findOneAndUpdate).not.toHaveBeenCalled();
    });

    it('should update user insurance if policy number is not in use', async () => {
      const mockUpdatedUser = {
        patientId: mockPatientId,
        policyNumber: mockPolicyNumber
      };
      
      (Patients.findOne as jest.Mock).mockResolvedValue(null);
      (Patients.findOneAndUpdate as jest.Mock).mockResolvedValue(mockUpdatedUser);

      const result = await UserService.updateInsurance(mockPatientId, mockPolicyNumber);

      expect(Patients.findOne).toHaveBeenCalled();
      expect(Patients.findOneAndUpdate).toHaveBeenCalledWith(
        { patientId: mockPatientId },
        { policyNumber: mockPolicyNumber },
        { new: true }
      );
      expect(result).toEqual(mockUpdatedUser);
    });
  });
});
