const express = require('express');
const { protect } = require('../middleware/auth');
const { requireSpaceMembership } = require('../middleware/spaceMembership');
const {
  createChore,
  getChores,
  getChore,
  updateChore,
  deleteChore,
} = require('../controllers/choreController');

// mergeParams: true gives us access to :spaceId from the parent router
const router = express.Router({ mergeParams: true });

// All chore routes require authentication
router.use(protect);

// POST /api/spaces/:spaceId/chores — create a chore (owner/admin)
router.post(
  '/',
  requireSpaceMembership('owner', 'admin'),
  createChore
);

// GET /api/spaces/:spaceId/chores — list chores (any active member)
router.get(
  '/',
  requireSpaceMembership('owner', 'admin', 'member'),
  getChores
);

// GET /api/spaces/:spaceId/chores/:choreId — get single chore (any active member)
router.get(
  '/:choreId',
  requireSpaceMembership('owner', 'admin', 'member'),
  getChore
);

// PATCH /api/spaces/:spaceId/chores/:choreId — update chore (owner/admin)
router.patch(
  '/:choreId',
  requireSpaceMembership('owner', 'admin'),
  updateChore
);

// DELETE /api/spaces/:spaceId/chores/:choreId — delete chore (owner/admin)
router.delete(
  '/:choreId',
  requireSpaceMembership('owner', 'admin'),
  deleteChore
);

module.exports = router;
