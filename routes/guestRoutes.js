const express = require('express');
const { protect } = require('../middleware/auth');
const { requireSpaceMembership } = require('../middleware/spaceMembership');
const {
  createGuest,
  getGuests,
  getGuest,
  updateGuest,
  deleteGuest,
} = require('../controllers/guestController');

// mergeParams: true gives us access to :spaceId from the parent router
const router = express.Router({ mergeParams: true });

// All guest routes require authentication
router.use(protect);

// POST /api/spaces/:spaceId/guests — register a guest (any active member)
router.post(
  '/',
  requireSpaceMembership('owner', 'admin', 'member'),
  createGuest
);

// GET /api/spaces/:spaceId/guests — list guests (any active member)
router.get(
  '/',
  requireSpaceMembership('owner', 'admin', 'member'),
  getGuests
);

// GET /api/spaces/:spaceId/guests/:guestId — get single guest (any active member)
router.get(
  '/:guestId',
  requireSpaceMembership('owner', 'admin', 'member'),
  getGuest
);

// PATCH /api/spaces/:spaceId/guests/:guestId — update guest (any active member)
router.patch(
  '/:guestId',
  requireSpaceMembership('owner', 'admin', 'member'),
  updateGuest
);

// DELETE /api/spaces/:spaceId/guests/:guestId — delete guest (owner/admin)
router.delete(
  '/:guestId',
  requireSpaceMembership('owner', 'admin'),
  deleteGuest
);

module.exports = router;
