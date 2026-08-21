const express = require('express');
const { protect } = require('../middleware/auth');
const { requireSpaceMembership } = require('../middleware/spaceMembership');
const {
  createPayment,
  getPayments,
  getPayment,
  updatePayment,
  deletePayment,
} = require('../controllers/paymentController');

// mergeParams: true gives us access to :spaceId and :billId from parent routers
const router = express.Router({ mergeParams: true });

// All payment routes require authentication
router.use(protect);

// POST /api/spaces/:spaceId/bills/:billId/payments — create a payment (any active member)
router.post(
  '/',
  requireSpaceMembership('owner', 'admin', 'member'),
  createPayment
);

// GET /api/spaces/:spaceId/bills/:billId/payments — list payments (any active member)
router.get(
  '/',
  requireSpaceMembership('owner', 'admin', 'member'),
  getPayments
);

// GET /api/spaces/:spaceId/bills/:billId/payments/:paymentId — get single (any active member)
router.get(
  '/:paymentId',
  requireSpaceMembership('owner', 'admin', 'member'),
  getPayment
);

// PATCH /api/spaces/:spaceId/bills/:billId/payments/:paymentId — update (owner/admin)
router.patch(
  '/:paymentId',
  requireSpaceMembership('owner', 'admin'),
  updatePayment
);

// DELETE /api/spaces/:spaceId/bills/:billId/payments/:paymentId — delete (owner/admin)
router.delete(
  '/:paymentId',
  requireSpaceMembership('owner', 'admin'),
  deletePayment
);

module.exports = router;
