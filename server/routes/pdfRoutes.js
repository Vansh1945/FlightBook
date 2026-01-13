import express from 'express';
const router = express.Router();
import { downloadTicketPDF } from '../controllers/pdfController.js';
import { protect } from '../middleware/authMiddleware.js';

// GET /api/ticket/:pnr - Download ticket PDF (protected)
router.get('/:pnr', protect, downloadTicketPDF);

export default router;
