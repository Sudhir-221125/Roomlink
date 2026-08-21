const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    bill_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Bill',
      required: [true, 'Bill reference is required'],
      index: true,
    },
    paid_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Paid by user is required'],
      index: true,
    },
    amount: {
      type: Number,
      required: [true, 'Payment amount is required'],
      min: [0, 'Amount cannot be negative'],
    },
    method: {
      type: String,
      required: [true, 'Payment method is required'],
      enum: {
        values: ['upi', 'bank_transfer', 'cash'],
        message: '{VALUE} is not a supported payment method',
      },
      trim: true,
    },
    transaction_id: {
      type: String,
      default: null,
      trim: true,
    },
    status: {
      type: String,
      enum: {
        values: ['pending_verification', 'verified', 'failed'],
        message: '{VALUE} is not a valid payment status',
      },
      default: 'pending_verification',
      index: true,
    },
    paid_at: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
  }
);

paymentSchema.index({ bill_id: 1, paid_by: 1 });

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
