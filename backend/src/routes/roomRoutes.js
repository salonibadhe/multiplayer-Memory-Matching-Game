import { Router } from 'express';
import { createRoom, getRoom, joinRoom } from '../controllers/roomController.js';
import { auth } from '../middleware/auth.js';

const router = Router();
router.post('/create', auth, createRoom);
router.post('/join', auth, joinRoom);
router.get('/:code', auth, getRoom);

export default router;
