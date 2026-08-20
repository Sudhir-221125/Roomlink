const express = require('express');
const { protect } = require('../middleware/auth');
const { requireSpaceMembership } = require('../middleware/spaceMembership');
const {
  createSpace,
  getMySpaces,
  getSpace,
  updateSpace,
  deleteSpace,
} = require('../controllers/spaceController');

const router = express.Router();

// All space routes require authentication
router.use(protect);

// POST /api/spaces — create a new space
router.post('/', createSpace);

// GET /api/spaces — list user's spaces
router.get('/', getMySpaces);

// GET /api/spaces/:spaceId — get single space
router.get(
  '/:spaceId',
  requireSpaceMembership('owner', 'admin', 'member'),
  getSpace
);

// PATCH /api/spaces/:spaceId — update space details
router.patch(
  '/:spaceId',
  requireSpaceMembership('owner', 'admin'),
  updateSpace
);

// DELETE /api/spaces/:spaceId — delete space (owner only)
router.delete(
  '/:spaceId',
  requireSpaceMembership('owner'),
  deleteSpace
);

// Nest membership routes under /api/spaces/:spaceId/members
router.use('/:spaceId/members', require('./membershipRoutes'));

// Nest bill routes under /api/spaces/:spaceId/bills
router.use('/:spaceId/bills', require('./billRoutes'));

module.exports = router;
