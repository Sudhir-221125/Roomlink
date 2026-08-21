const express = require('express');
const { protect } = require('../middleware/auth');
const { requireSpaceMembership } = require('../middleware/spaceMembership');
const {
  getMembers,
  addMember,
  removeMember,
  updateMemberRole,
  leaveSpace,
} = require('../controllers/membershipController');

// mergeParams: true gives us access to :spaceId from the parent router
const router = express.Router({ mergeParams: true });

// All membership routes require authentication
router.use(protect);

// POST /api/spaces/:spaceId/leave — must be before /:userId routes
router.post(
  '/leave',
  requireSpaceMembership('owner', 'admin', 'member'),
  leaveSpace
);

// GET /api/spaces/:spaceId/members
router.get(
  '/',
  requireSpaceMembership('owner', 'admin', 'member'),
  getMembers
);

// POST /api/spaces/:spaceId/members
router.post(
  '/',
  requireSpaceMembership('owner', 'admin'),
  addMember
);

// DELETE /api/spaces/:spaceId/members/:userId
router.delete(
  '/:userId',
  requireSpaceMembership('owner', 'admin'),
  removeMember
);

// PATCH /api/spaces/:spaceId/members/:userId
router.patch(
  '/:userId',
  requireSpaceMembership('owner'),
  updateMemberRole
);

module.exports = router;
