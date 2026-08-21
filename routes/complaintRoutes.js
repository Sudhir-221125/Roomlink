const express = require('express');
const { protect } = require('../middleware/auth');
const { requireSpaceMembership } = require('../middleware/spaceMembership');
const {
  createComplaint,
  getComplaints,
  getComplaint,
  updateComplaint,
  deleteComplaint,
} = require('../controllers/complaintController');

// mergeParams: true gives us access to :spaceId from the parent router
const router = express.Router({ mergeParams: true });

// All complaint routes require authentication
router.use(protect);

// POST /api/spaces/:spaceId/complaints — create a complaint (any active member)
router.post(
  '/',
  requireSpaceMembership('owner', 'admin', 'member'),
  createComplaint
);

// GET /api/spaces/:spaceId/complaints — list complaints (any active member)
router.get(
  '/',
  requireSpaceMembership('owner', 'admin', 'member'),
  getComplaints
);

// GET /api/spaces/:spaceId/complaints/:complaintId — get single (any active member)
router.get(
  '/:complaintId',
  requireSpaceMembership('owner', 'admin', 'member'),
  getComplaint
);

// PATCH /api/spaces/:spaceId/complaints/:complaintId — update (any member, controller enforces ownership)
router.patch(
  '/:complaintId',
  requireSpaceMembership('owner', 'admin', 'member'),
  updateComplaint
);

// DELETE /api/spaces/:spaceId/complaints/:complaintId — delete (owner/admin only)
router.delete(
  '/:complaintId',
  requireSpaceMembership('owner', 'admin'),
  deleteComplaint
);

module.exports = router;
