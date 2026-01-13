import express from 'express';
const router = express.Router();
import { getWalletBalance, deductWalletAmount, resetWallet } from '../controllers/walletController.js';
import { protect } from '../middleware/authMiddleware.js';

// GET /api/wallet - Get wallet balance
router.get('/', protect, getWalletBalance);

// POST /api/wallet/deduct - Deduct amount from wallet
router.post('/deduct', protect, deductWalletAmount);

// POST /api/wallet/reset - Reset wallet balance
router.post('/reset', protect, resetWallet);

export default router;
