import express from 'express';
const router = express.Router();
import { createBooking, getBookingHistory, getBookingByPNR } from '../controllers/bookingController.js';
import { protect } from '../middleware/authMiddleware.js';

// POST /api/bookings - Create a new booking (protected)
router.post('/', protect, createBooking);

// GET /api/bookings - Get booking history for logged-in user (protected)
router.get('/', protect, getBookingHistory);

// GET /api/bookings/:pnr - Get booking by PNR
router.get('/:pnr', getBookingByPNR);

export default router;
