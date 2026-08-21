const mongoose = require('mongoose');
const Membership = require('../models/Membership');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { ok, created } = require('../utils/apiResponse');
const { createNotification } = require('../utils/notifyHelper');

// ─────────────────────────────────────────────
// GET /api/spaces/:spaceId/members
// ─────────────────────────────────────────────
const getMembers = catchAsync(async (req, res) => {
  const members = await Membership.find({
    space_id: req.space._id,
    is_active: true,
  }).populate('user_id', 'name email phone');

  return ok(res, 'Members retrieved successfully.', { members });
});

// ─────────────────────────────────────────────
// POST /api/spaces/:spaceId/members
// ─────────────────────────────────────────────
const addMember = catchAsync(async (req, res) => {
  const { email, role_in_space } = req.body;

  // 1. Validate email is provided
  if (!email) {
    throw new ApiError(400, 'Email is required to add a member.');
  }

  // 2. Determine the target role (default: 'member')
  const targetRole = role_in_space || 'member';

  // 3. Validate the target role value
  if (!['admin', 'member'].includes(targetRole)) {
    throw new ApiError(400, 'Role must be "admin" or "member". Cannot assign "owner" role.');
  }

  // 4. Role elevation constraint: only owner can add someone as admin
  if (targetRole === 'admin' && req.membership.role_in_space !== 'owner') {
    throw new ApiError(403, 'Only the space owner can add members as admin.');
  }

  // 5. Find the target user by email
  const targetUser = await User.findOne({ email }).select('-password_hash');
  if (!targetUser) {
    throw new ApiError(404, 'No user found with that email.');
  }

  // 6. Check if membership already exists (active or inactive)
  const existingMembership = await Membership.findOne({
    space_id: req.space._id,
    user_id: targetUser._id,
  });

  let member;

  if (existingMembership) {
    if (existingMembership.is_active) {
      throw new ApiError(409, 'This user is already an active member of the space.');
    }

    // Reactivate inactive membership
    existingMembership.is_active = true;
    existingMembership.role_in_space = targetRole;
    existingMembership.joined_at = new Date();
    await existingMembership.save();
    member = existingMembership;
  } else {
    // Create new membership
    member = await Membership.create({
      user_id: targetUser._id,
      space_id: req.space._id,
      role_in_space: targetRole,
    });
  }

  // 7. Populate user info for the response
  await member.populate('user_id', 'name email phone');

  // 8. Notify the added user
  createNotification({
    user_id: targetUser._id,
    type: 'member',
    title: 'Added to space',
    message: `You have been added to the space "${req.space.name}" as ${targetRole}.`,
  });

  return created(res, 'Member added successfully.', { member });
});

// ─────────────────────────────────────────────
// DELETE /api/spaces/:spaceId/members/:userId
// ─────────────────────────────────────────────
const removeMember = catchAsync(async (req, res) => {
  const { userId } = req.params;

  // 1. Validate userId
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new ApiError(400, 'Invalid user ID.');
  }

  // 2. Cannot remove yourself via this endpoint (use /leave instead)
  if (userId === req.user._id.toString()) {
    throw new ApiError(400, 'Cannot remove yourself. Use the leave endpoint instead.');
  }

  // 3. Find the target membership
  const targetMembership = await Membership.findOne({
    space_id: req.space._id,
    user_id: userId,
    is_active: true,
  });

  if (!targetMembership) {
    throw new ApiError(404, 'Member not found in this space.');
  }

  // 4. Cannot remove the owner
  if (targetMembership.role_in_space === 'owner') {
    throw new ApiError(403, 'Cannot remove the space owner.');
  }

  // 5. Admin cannot remove another admin (only owner can)
  if (
    targetMembership.role_in_space === 'admin' &&
    req.membership.role_in_space !== 'owner'
  ) {
    throw new ApiError(403, 'Only the space owner can remove an admin.');
  }

  // 6. Soft-deactivate
  targetMembership.is_active = false;
  await targetMembership.save();

  // 7. Notify the removed user
  createNotification({
    user_id: userId,
    type: 'member',
    title: 'Removed from space',
    message: `You have been removed from the space "${req.space.name}".`,
  });

  return ok(res, 'Member removed from the space.');
});

// ─────────────────────────────────────────────
// PATCH /api/spaces/:spaceId/members/:userId
// ─────────────────────────────────────────────
const updateMemberRole = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const { role_in_space } = req.body;

  // 1. Validate userId
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new ApiError(400, 'Invalid user ID.');
  }

  // 2. Validate the new role
  if (!role_in_space) {
    throw new ApiError(400, 'role_in_space is required.');
  }

  if (!['admin', 'member'].includes(role_in_space)) {
    throw new ApiError(400, 'Role must be "admin" or "member". Cannot assign "owner" role.');
  }

  // 3. Cannot change own role
  if (userId === req.user._id.toString()) {
    throw new ApiError(400, 'Cannot change your own role.');
  }

  // 4. Find the target membership
  const targetMembership = await Membership.findOne({
    space_id: req.space._id,
    user_id: userId,
    is_active: true,
  });

  if (!targetMembership) {
    throw new ApiError(404, 'Member not found in this space.');
  }

  // 5. Cannot change the owner's role
  if (targetMembership.role_in_space === 'owner') {
    throw new ApiError(403, 'Cannot change the owner\'s role.');
  }

  // 6. Update the role
  targetMembership.role_in_space = role_in_space;
  await targetMembership.save();

  await targetMembership.populate('user_id', 'name email phone');

  return ok(res, 'Member role updated successfully.', { member: targetMembership });
});

// ─────────────────────────────────────────────
// POST /api/spaces/:spaceId/leave
// ─────────────────────────────────────────────
const leaveSpace = catchAsync(async (req, res) => {
  // req.membership is set by requireSpaceMembership middleware

  // Owner cannot leave — must delete the space instead
  if (req.membership.role_in_space === 'owner') {
    throw new ApiError(
      403,
      'Owner cannot leave the space. Delete the space instead.'
    );
  }

  // Soft-deactivate
  req.membership.is_active = false;
  await req.membership.save();

  return ok(res, 'You have left the space.');
});

module.exports = { getMembers, addMember, removeMember, updateMemberRole, leaveSpace };
