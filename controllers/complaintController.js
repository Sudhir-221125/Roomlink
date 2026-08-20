const mongoose = require('mongoose');
const Complaint = require('../models/Complaint');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { ok, created } = require('../utils/apiResponse');

const VALID_STATUSES = ['open', 'in_progress', 'resolved', 'closed'];

// ─────────────────────────────────────────────
// POST /api/spaces/:spaceId/complaints
// ─────────────────────────────────────────────
const createComplaint = catchAsync(async (req, res) => {
  const { type, title, description, status } = req.body;

  // Validate required fields
  if (!type || !type.trim()) {
    throw new ApiError(400, 'Type is required.');
  }
  if (!title || !title.trim()) {
    throw new ApiError(400, 'Title is required.');
  }
  if (!description || !description.trim()) {
    throw new ApiError(400, 'Description is required.');
  }

  // Validate status if provided
  if (status !== undefined && !VALID_STATUSES.includes(status)) {
    throw new ApiError(400, `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}.`);
  }

  // space_id from URL param, raised_by from authenticated user — never from client
  const complaint = await Complaint.create({
    space_id: req.space._id,
    raised_by: req.user._id,
    type: type.trim(),
    title: title.trim(),
    description: description.trim(),
    status: status || 'open',
  });

  return created(res, 'Complaint created successfully.', { complaint });
});

// ─────────────────────────────────────────────
// GET /api/spaces/:spaceId/complaints
// ─────────────────────────────────────────────
const getComplaints = catchAsync(async (req, res) => {
  const complaints = await Complaint.find({ space_id: req.space._id })
    .populate('raised_by', 'name email phone')
    .sort({ created_at: -1 });

  return ok(res, 'Complaints retrieved successfully.', { complaints });
});

// ─────────────────────────────────────────────
// GET /api/spaces/:spaceId/complaints/:complaintId
// ─────────────────────────────────────────────
const getComplaint = catchAsync(async (req, res) => {
  const { complaintId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(complaintId)) {
    throw new ApiError(400, 'Invalid complaint ID.');
  }

  const complaint = await Complaint.findOne({
    _id: complaintId,
    space_id: req.space._id,
  }).populate('raised_by', 'name email phone');

  if (!complaint) {
    throw new ApiError(404, 'Complaint not found in this space.');
  }

  return ok(res, 'Complaint retrieved successfully.', { complaint });
});

// ─────────────────────────────────────────────
// PATCH /api/spaces/:spaceId/complaints/:complaintId
// ─────────────────────────────────────────────
const updateComplaint = catchAsync(async (req, res) => {
  const { complaintId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(complaintId)) {
    throw new ApiError(400, 'Invalid complaint ID.');
  }

  const complaint = await Complaint.findOne({
    _id: complaintId,
    space_id: req.space._id,
  });

  if (!complaint) {
    throw new ApiError(404, 'Complaint not found in this space.');
  }

  const role = req.membership.role_in_space;
  const isOwnerOrAdmin = role === 'owner' || role === 'admin';
  const isRaiser = complaint.raised_by.toString() === req.user._id.toString();

  // Members can only update their own complaints
  if (!isOwnerOrAdmin && !isRaiser) {
    throw new ApiError(403, 'You can only update your own complaints.');
  }

  // Only allow updatable fields — never space_id, raised_by, or created_at
  const { type, title, description, status } = req.body;

  if (type !== undefined) {
    if (!type.trim()) {
      throw new ApiError(400, 'Type cannot be empty.');
    }
    complaint.type = type.trim();
  }

  if (title !== undefined) {
    if (!title.trim()) {
      throw new ApiError(400, 'Title cannot be empty.');
    }
    complaint.title = title.trim();
  }

  if (description !== undefined) {
    if (!description.trim()) {
      throw new ApiError(400, 'Description cannot be empty.');
    }
    complaint.description = description.trim();
  }

  if (status !== undefined) {
    if (!VALID_STATUSES.includes(status)) {
      throw new ApiError(400, `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}.`);
    }

    // Status changes (beyond content edits) are restricted to owner/admin
    if (!isOwnerOrAdmin && status !== complaint.status) {
      throw new ApiError(403, 'Only owner or admin can change complaint status.');
    }

    const oldStatus = complaint.status;
    complaint.status = status;

    // Handle resolved_at transitions
    if (status === 'resolved' && oldStatus !== 'resolved') {
      complaint.resolved_at = new Date();
    } else if (status !== 'resolved' && oldStatus === 'resolved') {
      complaint.resolved_at = null;
    }
  }

  await complaint.save();

  return ok(res, 'Complaint updated successfully.', { complaint });
});

// ─────────────────────────────────────────────
// DELETE /api/spaces/:spaceId/complaints/:complaintId
// ─────────────────────────────────────────────
const deleteComplaint = catchAsync(async (req, res) => {
  const { complaintId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(complaintId)) {
    throw new ApiError(400, 'Invalid complaint ID.');
  }

  const complaint = await Complaint.findOne({
    _id: complaintId,
    space_id: req.space._id,
  });

  if (!complaint) {
    throw new ApiError(404, 'Complaint not found in this space.');
  }

  await Complaint.findByIdAndDelete(complaint._id);

  return ok(res, 'Complaint deleted successfully.');
});

module.exports = { createComplaint, getComplaints, getComplaint, updateComplaint, deleteComplaint };
