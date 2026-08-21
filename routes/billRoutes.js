const express = require('express');
const { protect } = require('../middleware/auth');
const { requireSpaceMembership } = require('../middleware/spaceMembership');
const {
  createBill,
  getBills,
  getBill,
  updateBill,
  deleteBill,
} = require('../controllers/billController');

// mergeParams: true gives us access to :spaceId from the parent router
const router = express.Router({ mergeParams: true });

// All bill routes require authentication
router.use(protect);

// POST /api/spaces/:spaceId/bills — create a bill (owner/admin)
router.post(
  '/',
  requireSpaceMembership('owner', 'admin'),
  createBill
);

// GET /api/spaces/:spaceId/bills — list bills (any active member)
router.get(
  '/',
  requireSpaceMembership('owner', 'admin', 'member'),
  getBills
);

// GET /api/spaces/:spaceId/bills/:billId — get single bill (any active member)
router.get(
  '/:billId',
  requireSpaceMembership('owner', 'admin', 'member'),
  getBill
);

// PATCH /api/spaces/:spaceId/bills/:billId — update bill (owner/admin)
router.patch(
  '/:billId',
  requireSpaceMembership('owner', 'admin'),
  updateBill
);

// DELETE /api/spaces/:spaceId/bills/:billId — delete bill (owner/admin)
router.delete(
  '/:billId',
  requireSpaceMembership('owner', 'admin'),
  deleteBill
);

// Nest payment routes under /api/spaces/:spaceId/bills/:billId/payments
router.use('/:billId/payments', require('./paymentRoutes'));

module.exports = router;
