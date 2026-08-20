const mongoose = require('mongoose');
const Chore = require('../models/Chore');
const Membership = require('../models/Membership');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { ok, created } = require('../utils/apiResponse');

/**
 * Verify that a user exists and is an active member of the given space.
 * Returns the User document (without password_hash) on success.
 *
 * @param {string} userId    — ObjectId string to validate
 * @param {string} spaceId   — the space the user must belong to
 */
const verifyAssignee = async (userId, spaceId) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new ApiError(400, 'Invalid assigned_to user ID.');
  }

  const user = await User.findById(userId).select('-password_hash');
  if (!user) {
    throw new ApiError(404, 'Assigned user not found.');
  }

  const membership = await Membership.findOne({
    user_id: userId,
    space_id: spaceId,
    is_active: true,
  });

  if (!membership) {
    throw new ApiError(400, 'Assigned user is not an active member of this space.');
  }

  return user;
};

// ─────────────────────────────────────────────
// POST /api/spaces/:spaceId/chores
// ─────────────────────────────────────────────
const createChore = catchAsync(async (req, res) => {
  const { title, description, assigned_to, due_date, status } = req.body;

  // Validate required fields
  if (!title || !title.trim()) {
    throw new ApiError(400, 'Title is required.');
  }

  // Validate due_date if provided
  if (due_date !== undefined && due_date !== null) {
    const parsedDate = new Date(due_date);
    if (isNaN(parsedDate.getTime())) {
      throw new ApiError(400, 'Due date must be a valid date.');
    }
  }

  // Validate status if provided (Mongoose enum will also enforce this,
  // but we give a cleaner 400 instead of a 500 validation error)
  const validStatuses = ['pending', 'in_progress', 'done'];
  if (status !== undefined && !validStatuses.includes(status)) {
    throw new ApiError(400, `Invalid status. Must be one of: ${validStatuses.join(', ')}.`);
  }

  // Validate assigned_to membership if provided
  if (assigned_to !== undefined && assigned_to !== null) {
    await verifyAssignee(assigned_to, req.space._id);
  }

  // space_id from URL param, created_by from authenticated user — never from client
  const chore = await Chore.create({
    space_id: req.space._id,
    title: title.trim(),
    description: description !== undefined ? description : '',
    assigned_to: assigned_to || null,
    due_date: due_date ? new Date(due_date) : null,
    status: status || 'pending',
    created_by: req.user._id,
  });

  return created(res, 'Chore created successfully.', { chore });
});

// ─────────────────────────────────────────────
// GET /api/spaces/:spaceId/chores
// ─────────────────────────────────────────────
const getChores = catchAsync(async (req, res) => {
  const chores = await Chore.find({ space_id: req.space._id })
    .populate('assigned_to', 'name email')
    .populate('created_by', 'name email')
    .sort({ due_date: 1 });

  return ok(res, 'Chores retrieved successfully.', { chores });
});

// ─────────────────────────────────────────────
// GET /api/spaces/:spaceId/chores/:choreId
// ─────────────────────────────────────────────
const getChore = catchAsync(async (req, res) => {
  const { choreId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(choreId)) {
    throw new ApiError(400, 'Invalid chore ID.');
  }

  const chore = await Chore.findOne({
    _id: choreId,
    space_id: req.space._id,
  })
    .populate('assigned_to', 'name email')
    .populate('created_by', 'name email');

  if (!chore) {
    throw new ApiError(404, 'Chore not found in this space.');
  }

  return ok(res, 'Chore retrieved successfully.', { chore });
});

// ─────────────────────────────────────────────
// PATCH /api/spaces/:spaceId/chores/:choreId
// ─────────────────────────────────────────────
const updateChore = catchAsync(async (req, res) => {
  const { choreId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(choreId)) {
    throw new ApiError(400, 'Invalid chore ID.');
  }

  const chore = await Chore.findOne({
    _id: choreId,
    space_id: req.space._id,
  });

  if (!chore) {
    throw new ApiError(404, 'Chore not found in this space.');
  }

  // Only allow updatable fields — never space_id or created_by
  const { title, description, assigned_to, due_date, status } = req.body;

  if (title !== undefined) {
    if (!title.trim()) {
      throw new ApiError(400, 'Title cannot be empty.');
    }
    chore.title = title.trim();
  }

  if (description !== undefined) {
    chore.description = description;
  }

  if (assigned_to !== undefined) {
    if (assigned_to === null) {
      chore.assigned_to = null;
    } else {
      await verifyAssignee(assigned_to, req.space._id);
      chore.assigned_to = assigned_to;
    }
  }

  if (due_date !== undefined) {
    if (due_date === null) {
      chore.due_date = null;
    } else {
      const parsedDate = new Date(due_date);
      if (isNaN(parsedDate.getTime())) {
        throw new ApiError(400, 'Due date must be a valid date.');
      }
      chore.due_date = parsedDate;
    }
  }

  if (status !== undefined) {
    const validStatuses = ['pending', 'in_progress', 'done'];
    if (!validStatuses.includes(status)) {
      throw new ApiError(400, `Invalid status. Must be one of: ${validStatuses.join(', ')}.`);
    }
    chore.status = status;
  }

  await chore.save();

  return ok(res, 'Chore updated successfully.', { chore });
});

// ─────────────────────────────────────────────
// DELETE /api/spaces/:spaceId/chores/:choreId
// ─────────────────────────────────────────────
const deleteChore = catchAsync(async (req, res) => {
  const { choreId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(choreId)) {
    throw new ApiError(400, 'Invalid chore ID.');
  }

  const chore = await Chore.findOne({
    _id: choreId,
    space_id: req.space._id,
  });

  if (!chore) {
    throw new ApiError(404, 'Chore not found in this space.');
  }

  await Chore.findByIdAndDelete(chore._id);

  return ok(res, 'Chore deleted successfully.');
});

module.exports = { createChore, getChores, getChore, updateChore, deleteChore };
