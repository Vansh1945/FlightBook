import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  flightId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Flight',
    required: true
  },
  passengerName: {
    type: String,
    required: true
  },
  flight_id: {
    type: String,
    required: true
  },
  airline: {
    type: String,
    required: true
  },
  route: {
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
  final_price: {
    type: Number,
    required: true
  },
  booking_date_time: {
    type: Date,
    default: Date.now
  },
  pnr: {
    type: String,
    unique: true,
    required: true
  }
});

export default mongoose.model('Booking', bookingSchema);
