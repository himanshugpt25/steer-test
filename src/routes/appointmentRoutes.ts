import { Router } from 'express';
import { requestAppointment } from '../controllers/appointmentController';
import { validateAppointmentCreation } from '../middleware/validation';
import { logRequest } from '../middleware/logRequest';
    
const router = Router();

router.post('/appointments', logRequest, validateAppointmentCreation, requestAppointment);

export default router;