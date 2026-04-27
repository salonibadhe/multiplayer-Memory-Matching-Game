import { Router } from 'express';

const router = Router();
router.get('/health', (_req, res) => res.json({ status: 'ok', realtime: 'socket.io' }));

export default router;
