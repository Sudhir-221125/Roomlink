const mongoose = require('mongoose');

const guestSchema = new mongoose.Schema(
  {
    space_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Space',
      required: [true, 'Space reference is required'],
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Guest name is required'],
      trim: true,
    },
    phone: {
      type: String,
      default: null,
      trim: true,
    },
    purpose: {
      type: String,
      default: '',
      trim: true,
    },
    check_in: {
      type: Date,
      default: Date.now,
    },
    check_out: {
      type: Date,
      default: null,
    },
    registered_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Registered by user is required'],
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

guestSchema.index({ space_id: 1, check_in: -1 });

const Guest = mongoose.model('Guest', guestSchema);

module.exports = Guest;
