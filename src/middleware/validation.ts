import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import { logger } from '../utils/logger';
import { ResponseHandler } from '../utils/responseHandler';

// Validate user creation request
export const validateUserCreation = [
  body('sessionInfo')
    .exists()
    .withMessage('Session info is required')
    .notEmpty()
    .withMessage('Session info cannot be empty'),
  body('sessionInfo.parameters')
    .exists()
    .withMessage('Parameters are required')
    .notEmpty()
    .withMessage('Parameters cannot be empty'),
  body('sessionInfo.parameters.firstName')
    .trim()
    .notEmpty()
    .withMessage('First name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
  body('sessionInfo.parameters.lastName')
    .trim()
    .notEmpty()
    .withMessage('Last name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),
  body('sessionInfo.parameters.birthDate')
    .notEmpty()
    .withMessage('Birth date is required here')
    .custom((value) => {
      const { day, month, year } = value;
      if (!day || !month || !year) {
        throw new Error('Day, month and year are required for birth date');
      }
      const date = new Date(year, month - 1, day); // month is 0-based
      const now = new Date();
      if (date > now) {
        throw new Error('Date of birth cannot be in the future');
      }
      if (isNaN(date.getTime())) {
        throw new Error('Invalid date format');
      }
      return true;
    }),
  validateRequest
];

// Validate insurance update request
export const validateInsuranceUpdate = [
  body('sessionInfo')
    .exists()
    .withMessage('Session info is required')
    .notEmpty()
    .withMessage('Session info cannot be empty'),
  body('sessionInfo.parameters')
    .exists()
    .withMessage('Parameters are required')
    .notEmpty()
    .withMessage('Parameters cannot be empty'),
  body('sessionInfo.parameters.patientId')
    .notEmpty()
    .withMessage('Patient ID is required'),
  body('sessionInfo.parameters.insuranceNumber')
    .trim()
    .notEmpty()
    .withMessage('Insurance number is required')
    .isLength({ min: 5, max: 50 })
    .withMessage('Insurance number must be between 5 and 50 characters'),
  validateRequest
];

// Validate appointment creation request
export const validateAppointmentCreation = [
  body('sessionInfo')
    .exists()
    .withMessage('Session info is required')
    .notEmpty()
    .withMessage('Session info cannot be empty'),
  body('sessionInfo.parameters')
    .exists()
    .withMessage('Parameters are required')
    .notEmpty()
    .withMessage('Parameters cannot be empty'),
  body('sessionInfo.parameters.patientId')
    .notEmpty()
    .withMessage('Patient ID is required'),
  body('sessionInfo.parameters.appointmentType')
    .trim()
    .notEmpty()
    .withMessage('Booking type is required')
    .isIn(['consultation', 'follow-up', 'check-up'])
    .withMessage('Invalid booking type'),
  body('sessionInfo.parameters.appointmentTime')
    .custom((value) => {
      if (!value || typeof value !== 'object') {
        throw new Error('Appointment time must be a valid object');
      }
      const { year, month, day, hours, minutes, seconds = 0, nanos = 0 } = value;
      
      // Validate all required fields exist and are numbers
      if (!year || !month || !day || !hours || minutes === undefined ||
          !Number.isInteger(year) || !Number.isInteger(month) || 
          !Number.isInteger(day) || !Number.isInteger(hours) ||
          !Number.isInteger(minutes)) {
        throw new Error('Invalid appointment time format');
      }

      const date = new Date(year, month - 1, day, hours, minutes, seconds, nanos/1000000);
      const now = new Date();

      if (date <= now) {
        throw new Error('Appointment time must be in the future');
      }
      
      // Validate ranges
      if (month < 1 || month > 12) throw new Error('Invalid month');
      if (day < 1 || day > 31) throw new Error('Invalid day');
      if (hours < 0 || hours > 23) throw new Error('Invalid hours');
      if (minutes < 0 || minutes > 59) throw new Error('Invalid minutes');
      
      return true;
    }),
  validateRequest
];

// Generic validation request handler
function validateRequest(req: Request, res: Response, next: NextFunction) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.error(`Validation errors: ${JSON.stringify(errors.array())}`);
    return ResponseHandler.error(res, 'input validation failed', 400, {
      "messages": [{
        "text": {
          "text": errors.array().map(err => err.msg)
          // "text":["input validation failed"]
        }
      }]
    });
    // return res.status(400).json({ errors: errors.array() });
  }
  next();
}