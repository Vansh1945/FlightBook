import Booking from '../models/Booking.js';
import User from '../models/User.js';
import Flight from '../models/Flight.js';
import Wallet from '../models/Wallet.js';
import { v4 as uuidv4 } from 'uuid';
import { generateTicketPDF } from '../utils/generateTicketPDF.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create a new booking
const createBooking = async (req, res) => {
  try {
    const { flightId, passengerName } = req.body;
    const userId = req.user.id;

    // Validate flight and seat availability
    const flight = await Flight.findById(flightId);
    if (!flight) {
      return res.status(404).json({ message: 'Flight not found' });
    }
    if (flight.seatsAvailable <= 0) {
      return res.status(400).json({ message: 'No seats available' });
    }

    // Dynamic pricing logic
    let attemptRecord = await PricingAttempts.findOne({ flightId, userId });
    let totalPrice = flight.base_price;

    if (attemptRecord) {
      const now = new Date();
      const timeDiff = (now - attemptRecord.firstAttemptTime) / 1000 / 60; // minutes

      if (timeDiff > 10) {
        // Reset attempts after 10 minutes
        attemptRecord.attemptCount = 1;
        attemptRecord.firstAttemptTime = now;
      } else {
        attemptRecord.attemptCount += 1;
        if (attemptRecord.attemptCount >= 3) {
          totalPrice = Math.round(totalPrice * 1.1); // 10% increase
        }
      }
    } else {
      // First attempt
      attemptRecord = new PricingAttempts({
        flightId,
        userId,
        attemptCount: 1,
        firstAttemptTime: new Date()
      });
    }

    await attemptRecord.save();

    // Check wallet balance
    const wallet = await Wallet.findOne({ userId });
    if (!wallet || wallet.balance < totalPrice) {
      return res.status(400).json({ message: 'Insufficient wallet balance' });
    }

    // Deduct amount from wallet
    wallet.balance -= totalPrice;
    await wallet.save();

    // Generate unique PNR
    const pnr = uuidv4().toUpperCase().substring(0, 8);

    // Save booking
    const booking = new Booking({
      userId,
      flightId,
      passengerName,
      flight_id: flight.flight_id,
      airline: flight.airline,
      route: `${flight.departure_city} → ${flight.arrival_city}`,
      final_price: totalPrice,
      pnr
    });
    await booking.save();

    // Update flight seats
    flight.seatsAvailable -= 1;
    await flight.save();

    // Ensure tickets directory exists
    const ticketsDir = path.join(__dirname, '..', 'tickets');
    if (!fs.existsSync(ticketsDir)) {
      fs.mkdirSync(ticketsDir, { recursive: true });
    }

    // Generate PDF ticket
    const pdfPath = path.join(__dirname, '..', 'tickets', `Ticket_${pnr}.pdf`);
    await generateTicketPDF(pnr, passengerName, flight, totalPrice, booking.booking_date_time, pdfPath);

    res.status(201).json({
      message: 'Booking successful',
      booking: {
        id: booking._id,
        pnr,
        passengerName,
        flight: {
          flight_id: flight.flight_id,
          airline: flight.airline,
          route: `${flight.departure_city} → ${flight.arrival_city}`
        },
        final_price: totalPrice,
        booking_date_time: booking.booking_date_time
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get booking history for logged-in user
const getBookingHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const bookings = await Booking.find({ userId }).populate('flightId').sort({ booking_date_time: -1 });
    res.json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get booking by PNR
const getBookingByPNR = async (req, res) => {
  try {
    const { pnr } = req.params;
    const booking = await Booking.findOne({ pnr }).populate('flightId');
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.json(booking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export {
  createBooking,
  getBookingHistory,
  getBookingByPNR
};
