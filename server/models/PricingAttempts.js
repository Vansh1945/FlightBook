import mongoose from 'mongoose';

const pricingAttemptsSchema = new mongoose.Schema({
  flightId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Flight',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  attemptCount: {
    type: Number,
    default: 1
  },
  firstAttemptTime: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('PricingAttempts', pricingAttemptsSchema);
