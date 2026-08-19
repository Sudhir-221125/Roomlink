const mongoose = require('mongoose');

const choreSchema = new mongoose.Schema(
  {
    space_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Space',
      required: [true, 'Space reference is required'],
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Chore title is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    assigned_to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true,
    },
    due_date: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: {
        values: ['pending', 'in_progress', 'done'],
        message: '{VALUE} is not a valid chore status',
      },
      default: 'pending',
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

const Chore = mongoose.model('Chore', choreSchema);

module.exports = Chore;
