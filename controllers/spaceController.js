const Space = require('../models/Space');
const Membership = require('../models/Membership');
const Bill = require('../models/Bill');
const Payment = require('../models/Payment');
const Chore = require('../models/Chore');
const Complaint = require('../models/Complaint');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { ok, created } = require('../utils/apiResponse');

// ─────────────────────────────────────────────
// POST /api/spaces
// ─────────────────────────────────────────────
const createSpace = catchAsync(async (req, res) => {
  const { name, type, address, description } = req.body;

  // 1. Validate required fields
  if (!name || !type || !address) {
    throw new ApiError(400, 'Name, type, and address are required.');
  }

  // 2. Create the space
  const space = await Space.create({
    name,
    type,
    address,
    description: description || '',
    created_by: req.user._id,
  });

  // 3. Create owner membership for the creator
  let membership;
  try {
    membership = await Membership.create({
      user_id: req.user._id,
      space_id: space._id,
      role_in_space: 'owner',
    });
  } catch (err) {
    // Rollback: delete the space if membership creation fails
    await Space.findByIdAndDelete(space._id);
    throw err;
  }

  return created(res, 'Space created successfully.', { space, membership });
});

// ─────────────────────────────────────────────
// GET /api/spaces
// ─────────────────────────────────────────────
const getMySpaces = catchAsync(async (req, res) => {
  // 1. Find all active memberships for the current user
  const memberships = await Membership.find({
    user_id: req.user._id,
    is_active: true,
  });

  if (memberships.length === 0) {
    return ok(res, 'No spaces found.', { spaces: [] });
  }

  // 2. Build a map of spaceId → role_in_space
  const spaceIds = [];
  const roleMap = {};
  for (const m of memberships) {
    spaceIds.push(m.space_id);
    roleMap[m.space_id.toString()] = m.role_in_space;
  }

  // 3. Fetch the spaces
  const spaces = await Space.find({ _id: { $in: spaceIds } })
    .populate('created_by', 'name email');

  // 4. Attach role_in_space to each space object
  const spacesWithRole = spaces.map((s) => {
    const obj = s.toObject();
    obj.role_in_space = roleMap[s._id.toString()];
    return obj;
  });

  return ok(res, 'Spaces retrieved successfully.', { spaces: spacesWithRole });
});

// ─────────────────────────────────────────────
// GET /api/spaces/:spaceId
// ─────────────────────────────────────────────
const getSpace = catchAsync(async (req, res) => {
  // req.space and req.membership are set by requireSpaceMembership middleware
  const space = await Space.findById(req.space._id)
    .populate('created_by', 'name email');

  return ok(res, 'Space retrieved successfully.', {
    space,
    membership: req.membership,
  });
});

// ─────────────────────────────────────────────
// PATCH /api/spaces/:spaceId
// ─────────────────────────────────────────────
const updateSpace = catchAsync(async (req, res) => {
  const space = req.space;
  const { name, type, address, description } = req.body;

  // Only update fields that are present in the request body
  if (name !== undefined) space.name = name;
  if (type !== undefined) space.type = type;
  if (address !== undefined) space.address = address;
  if (description !== undefined) space.description = description;

  await space.save();

  return ok(res, 'Space updated successfully.', { space });
});

// ─────────────────────────────────────────────
// DELETE /api/spaces/:spaceId
// ─────────────────────────────────────────────
const deleteSpace = catchAsync(async (req, res) => {
  const spaceId = req.space._id;

  // Cascade delete all dependent data:
  //
  // 1. Payments — referenced via bill_id, not space_id.
  //    First find all bill IDs for this space, then delete payments for those bills.
  const bills = await Bill.find({ space_id: spaceId }).select('_id');
  const billIds = bills.map((b) => b._id);
  if (billIds.length > 0) {
    await Payment.deleteMany({ bill_id: { $in: billIds } });
  }

  // 2. Bills — have space_id
  await Bill.deleteMany({ space_id: spaceId });

  // 3. Chores — have space_id
  await Chore.deleteMany({ space_id: spaceId });

  // 4. Complaints — have space_id
  await Complaint.deleteMany({ space_id: spaceId });

  // 5. Memberships — have space_id
  await Membership.deleteMany({ space_id: spaceId });

  // 6. Notifications — do NOT have space_id (only user_id). Left untouched.

  // 7. Delete the space itself
  await Space.findByIdAndDelete(spaceId);

  return ok(res, 'Space and all associated data deleted successfully.');
});

module.exports = { createSpace, getMySpaces, getSpace, updateSpace, deleteSpace };
