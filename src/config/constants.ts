/**
 * Application-wide constants
 */
export const APPOINTMENT_TYPES = ['consultation', 'followup', 'emergency', 'routine'] as const;

export const VALIDATION = {
  NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 50
  },
  POLICY_NUMBER: {
    MIN_LENGTH: 5,
    MAX_LENGTH: 50
  }
};