import { Router } from 'express';
import { signup, login, getMe, refreshToken } from '../controllers/authController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/refresh', refreshToken);
router.get('/me', authenticateToken, getMe);

export default router;
