import { Router } from 'express';
import { getProfile } from '../controllers/profileController.js';
import { auth } from '../middleware/auth.js';

const router = Router();
router.get('/', auth, getProfile);

export default router;
