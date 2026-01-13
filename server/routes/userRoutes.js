import express from 'express';
const router = express.Router();
import { registerUser, loginUser, getUserProfile } from '../controllers/UserController.js';
import { protect } from '../middleware/authMiddleware.js';

// POST /api/users/register - Register a new user
router.post('/register', registerUser);

// POST /api/users/login - Login user
router.post('/login', loginUser);

// GET /api/users/profile - Get user profile (protected)
router.get('/profile', protect, getUserProfile);

export default router;
