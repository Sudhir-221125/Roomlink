const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema(
  {
    space_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Space',
      required: [true, 'Space reference is required'],
      index: true,
    },
    raised_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Raised by user is required'],
      index: true,
    },
    type: {
      type: String,
      required: [true, 'Complaint type is required'],
      trim: true,
    },
    title: {
      type: String,
      required: [true, 'Complaint title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Complaint description is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: {
        values: ['open', 'in_progress', 'resolved', 'closed'],
        message: '{VALUE} is not a valid complaint status',
      },
      default: 'open',
      index: true,
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
    resolved_at: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: false },
    versionKey: false,
  }
);

const Complaint = mongoose.model('Complaint', complaintSchema);

module.exports = Complaint;
