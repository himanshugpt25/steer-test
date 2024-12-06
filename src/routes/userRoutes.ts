import { Router } from 'express';
import { findOrCreateUser, updateInsurance } from '../controllers/userController';
import { validateUserCreation, validateInsuranceUpdate } from '../middleware/validation';
import { logRequest } from '../middleware/logRequest';

const router = Router();

router.post('/users',logRequest, validateUserCreation, findOrCreateUser);
router.post('/users/update', logRequest, validateInsuranceUpdate, updateInsurance);

export default router;