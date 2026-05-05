import mongoose from 'mongoose';

const ApplicationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    courseName: { type: String, required: true },
    startDate: { type: String, required: true },
    paymentMethod: { type: String, required: true },
    status: {
      type: String,
      enum: ['NEW', 'IN_PROGRESS', 'COMPLETED'],
      default: 'NEW'
    },
    reviewText: { type: String },
    reviewAt: { type: Date }
  },
  { timestamps: true }
);

export default mongoose.models.Application ||
  mongoose.model('Application', ApplicationSchema);
