const mongoose = require('mongoose');

const membershipSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
    },
    space_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Space',
      required: [true, 'Space reference is required'],
    },
    role_in_space: {
      type: String,
      enum: {
        values: ['owner', 'admin', 'member'],
        message: '{VALUE} is not a valid space role',
      },
      default: 'member',
    },
    joined_at: {
      type: Date,
      default: Date.now,
    },
    is_active: {
      type: Boolean,
      default: true,
    },
  },
  {
    versionKey: false,
  }
);

// Prevent duplicate memberships for the same user in the same space
membershipSchema.index({ space_id: 1, user_id: 1 }, { unique: true });
membershipSchema.index({ user_id: 1 });

const Membership = mongoose.model('Membership', membershipSchema);

module.exports = Membership;
