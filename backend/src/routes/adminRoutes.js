import { Router } from 'express';
import { createTheme, getStats, getUsers } from '../controllers/adminController.js';
import { adminOnly, auth } from '../middleware/auth.js';

const router = Router();
router.get('/users', auth, adminOnly, getUsers);
router.post('/themes', auth, adminOnly, createTheme);
router.get('/stats', auth, adminOnly, getStats);

export default router;
