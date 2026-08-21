const mongoose = require('mongoose');
const Membership = require('../models/Membership');
const Space = require('../models/Space');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');

/**
 * Middleware factory that verifies the authenticated user is an active member
 * of the space identified by req.params.spaceId, with one of the allowed roles.
 *
 * On success, attaches:
 *   req.space      — the Space document
 *   req.membership — the user's active Membership document
 *
 * @param  {...string} allowedRoles - e.g. 'owner', 'admin', 'member'
 * @returns {Function} Express middleware
 */
const requireSpaceMembership = (...allowedRoles) => {
  return catchAsync(async (req, res, next) => {
    const { spaceId } = req.params;

    // 1. Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(spaceId)) {
      throw new ApiError(400, 'Invalid space ID.');
    }

    // 2. Verify space exists
    const space = await Space.findById(spaceId);
    if (!space) {
      throw new ApiError(404, 'Space not found.');
    }

    // 3. Find user's active membership in this space
    const membership = await Membership.findOne({
      space_id: spaceId,
      user_id: req.user._id,
      is_active: true,
    });

    if (!membership) {
      throw new ApiError(403, 'You are not a member of this space.');
    }

    // 4. Check role
    if (allowedRoles.length > 0 && !allowedRoles.includes(membership.role_in_space)) {
      throw new ApiError(403, 'You do not have permission to perform this action.');
    }

    // 5. Attach to request
    req.space = space;
    req.membership = membership;
    next();
  });
};

module.exports = { requireSpaceMembership };
