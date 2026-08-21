const mongoose = require('mongoose');

const billSchema = new mongoose.Schema(
  {
    space_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Space',
      required: [true, 'Space reference is required'],
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Bill title is required'],
      trim: true,
    },
    amount: {
      type: Number,
      required: [true, 'Bill amount is required'],
      min: [0, 'Amount cannot be negative'],
    },
    due_date: {
      type: Date,
      required: [true, 'Due date is required'],
    },
    status: {
      type: String,
      enum: {
        values: ['unpaid', 'partial', 'paid'],
        message: '{VALUE} is not a valid bill status',
      },
      default: 'unpaid',
      index: true,
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Creator user is required'],
      index: true,
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: false },
    versionKey: false,
  }
);

const Bill = mongoose.model('Bill', billSchema);

module.exports = Bill;
