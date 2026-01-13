import express from 'express';
const router = express.Router();
import { getAllFlights, searchFlights, getFlightById, seedFlightData } from '../controllers/flightController.js';

// Public routes
router.get('/', getAllFlights);
router.get('/search', searchFlights);
router.get('/:id', getFlightById);

// Seed flights (one-time use, unprotected)
router.post('/seed', seedFlightData);

export default router;
