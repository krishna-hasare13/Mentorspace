import { Router } from 'express';
import {
  createSession,
  getSessions,
  getSession,
  joinSession,
  endSession,
  getMessages,
} from '../controllers/sessionController';
import { authenticateToken, requireRole } from '../middleware/auth';

const router = Router();

// All session routes require auth
router.use(authenticateToken);

router.post('/', requireRole('mentor'), createSession);
router.get('/', getSessions);
router.get('/:id', getSession);
router.post('/join', joinSession);
router.patch('/:id/end', requireRole('mentor'), endSession);
router.get('/:id/messages', getMessages);

export default router;
