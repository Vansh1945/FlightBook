import Flight from '../models/Flight.js';
import { calculateSurgePrice } from '../utils/surgePricing.js';
import { seedFlights } from '../utils/seedFlights.js';

// Get all flights
const getAllFlights = async (req, res, next) => {
  try {
    const flights = await Flight.find();

    const flightsWithSurge = flights.map(flight => {
      const current_price = calculateSurgePrice(flight.base_price, flight.seatsAvailable);
      const surge = flight.seatsAvailable < 20;
      return {
        id: flight._id,
        flight_id: flight.flight_id,
        airline: flight.airline,
        departure_city: flight.departure_city,
        arrival_city: flight.arrival_city,
        base_price: flight.base_price,
        current_price,
        seatsAvailable: flight.seatsAvailable,
        surge_attempts: flight.surge_attempts,
        surge
      };
    });

    res.json(flightsWithSurge);
  } catch (error) {
    next(error);
  }
};

// Search flights by from and to (case-insensitive)
const searchFlights = async (req, res, next) => {
  try {
    const { from, to } = req.query;

    if (!from || !to) {
      return res.status(400).json({
        success: false,
        message: 'Both from and to parameters are required'
      });
    }

    const flights = await Flight.find({
      departure_city: { $regex: new RegExp(from, 'i') },
      arrival_city: { $regex: new RegExp(to, 'i') }
    }).sort({ base_price: 1 }).limit(10);

    const flightsData = flights.map(flight => ({
      id: flight._id,
      flight_id: flight.flight_id,
      airline: flight.airline,
      departure_city: flight.departure_city,
      arrival_city: flight.arrival_city,
      base_price: flight.base_price,
      seatsAvailable: flight.seatsAvailable
    }));

    res.json(flightsData);
  } catch (error) {
    next(error);
  }
};

// Get flight by ID
const getFlightById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const flight = await Flight.findOne({ flight_id: id });

    if (!flight) {
      return res.status(404).json({
        success: false,
        message: 'Flight not found'
      });
    }

    const flightWithSurge = {
      ...flight.toObject(),
      currentPrice: calculateSurgePrice(flight.base_price, flight.seatsAvailable)
    };

    res.status(200).json({
      success: true,
      message: 'Flight fetched successfully',
      data: flightWithSurge
    });
  } catch (error) {
    next(error);
  }
};

// Seed flights (one-time use)
const seedFlightData = async (req, res, next) => {
  try {
    await seedFlights();
    res.status(200).json({
      success: true,
      message: 'Flights seeded successfully'
    });
  } catch (error) {
    next(error);
  }
};

export {
  getAllFlights,
  searchFlights,
  getFlightById,
  seedFlightData
};
