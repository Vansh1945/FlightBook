import mongoose from 'mongoose';

const flightSchema = new mongoose.Schema({
  flight_id: {
    type: String,
    unique: true,
    required: true
  },
  airline: {
    type: String,
    required: true
  },
  departure_city: {
    type: String,
    required: true
  },
  arrival_city: {
    type: String,
    required: true
  },
  base_price: {
    type: Number,
    required: true
  },
  current_price: {
    type: Number,
    required: true
  },
  surge_attempts: {
    type: Number,
    default: 0
  },
  last_attempt_time: {
    type: Date,
    default: null
  },
  seatsAvailable: {
    type: Number,
    default: 10,
    required: true
  }
});

export default mongoose.model('Flight', flightSchema);
