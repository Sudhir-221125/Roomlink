const mongoose = require('mongoose');
const Guest = require('../models/Guest');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { ok, created } = require('../utils/apiResponse');

// ─────────────────────────────────────────────
// POST /api/spaces/:spaceId/guests
// ─────────────────────────────────────────────
const createGuest = catchAsync(async (req, res) => {
  const { name, phone, purpose, check_in, check_out } = req.body;

  if (!name || !name.trim()) {
    throw new ApiError(400, 'Guest name is required.');
  }

  // Validate dates if provided
  if (check_in !== undefined && check_in !== null) {
    const d = new Date(check_in);
    if (isNaN(d.getTime())) {
      throw new ApiError(400, 'check_in must be a valid date.');
    }
  }

  if (check_out !== undefined && check_out !== null) {
    const d = new Date(check_out);
    if (isNaN(d.getTime())) {
      throw new ApiError(400, 'check_out must be a valid date.');
    }
  }

  const guest = await Guest.create({
    space_id: req.space._id,
    name: name.trim(),
    phone: phone || null,
    purpose: purpose || '',
    check_in: check_in ? new Date(check_in) : undefined,
    check_out: check_out ? new Date(check_out) : null,
    registered_by: req.user._id,
  });

  return created(res, 'Guest registered successfully.', { guest });
});

// ─────────────────────────────────────────────
// GET /api/spaces/:spaceId/guests
// ─────────────────────────────────────────────
const getGuests = catchAsync(async (req, res) => {
  const guests = await Guest.find({ space_id: req.space._id })
    .populate('registered_by', 'name email')
    .sort({ check_in: -1 });

  return ok(res, 'Guests retrieved successfully.', { guests });
});

// ─────────────────────────────────────────────
// GET /api/spaces/:spaceId/guests/:guestId
// ─────────────────────────────────────────────
const getGuest = catchAsync(async (req, res) => {
  const { guestId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(guestId)) {
    throw new ApiError(400, 'Invalid guest ID.');
  }

  const guest = await Guest.findOne({
    _id: guestId,
    space_id: req.space._id,
  }).populate('registered_by', 'name email');

  if (!guest) {
    throw new ApiError(404, 'Guest not found in this space.');
  }

  return ok(res, 'Guest retrieved successfully.', { guest });
});

// ─────────────────────────────────────────────
// PATCH /api/spaces/:spaceId/guests/:guestId
// ─────────────────────────────────────────────
const updateGuest = catchAsync(async (req, res) => {
  const { guestId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(guestId)) {
    throw new ApiError(400, 'Invalid guest ID.');
  }

  const guest = await Guest.findOne({
    _id: guestId,
    space_id: req.space._id,
  });

  if (!guest) {
    throw new ApiError(404, 'Guest not found in this space.');
  }

  const { name, phone, purpose, check_in, check_out } = req.body;

  if (name !== undefined) {
    if (!name.trim()) {
      throw new ApiError(400, 'Guest name cannot be empty.');
    }
    guest.name = name.trim();
  }

  if (phone !== undefined) {
    guest.phone = phone || null;
  }

  if (purpose !== undefined) {
    guest.purpose = purpose;
  }

  if (check_in !== undefined) {
    if (check_in === null) {
      guest.check_in = null;
    } else {
      const d = new Date(check_in);
      if (isNaN(d.getTime())) {
        throw new ApiError(400, 'check_in must be a valid date.');
      }
      guest.check_in = d;
    }
  }

  if (check_out !== undefined) {
    if (check_out === null) {
      guest.check_out = null;
    } else {
      const d = new Date(check_out);
      if (isNaN(d.getTime())) {
        throw new ApiError(400, 'check_out must be a valid date.');
      }
      guest.check_out = d;
    }
  }

  await guest.save();

  return ok(res, 'Guest updated successfully.', { guest });
});

// ─────────────────────────────────────────────
// DELETE /api/spaces/:spaceId/guests/:guestId
// ─────────────────────────────────────────────
const deleteGuest = catchAsync(async (req, res) => {
  const { guestId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(guestId)) {
    throw new ApiError(400, 'Invalid guest ID.');
  }

  const guest = await Guest.findOne({
    _id: guestId,
    space_id: req.space._id,
  });

  if (!guest) {
    throw new ApiError(404, 'Guest not found in this space.');
  }

  await Guest.findByIdAndDelete(guest._id);

  return ok(res, 'Guest deleted successfully.');
});

module.exports = { createGuest, getGuests, getGuest, updateGuest, deleteGuest };
