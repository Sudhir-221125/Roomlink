const mongoose = require('mongoose');
const Payment = require('../models/Payment');
const Bill = require('../models/Bill');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { ok, created } = require('../utils/apiResponse');

/**
 * Verify billId is valid and the Bill belongs to the Space from req.space.
 * Returns the Bill document on success.
 */
const verifyBill = async (billId, space) => {
  if (!mongoose.Types.ObjectId.isValid(billId)) {
    throw new ApiError(400, 'Invalid bill ID.');
  }

  const bill = await Bill.findOne({
    _id: billId,
    space_id: space._id,
  });

  if (!bill) {
    throw new ApiError(404, 'Bill not found in this space.');
  }

  return bill;
};

// ─────────────────────────────────────────────
// POST /api/spaces/:spaceId/bills/:billId/payments
// ─────────────────────────────────────────────
const createPayment = catchAsync(async (req, res) => {
  const bill = await verifyBill(req.params.billId, req.space);

  const { amount, method, transaction_id, paid_at } = req.body;

  // Validate required fields
  if (amount === undefined || amount === null) {
    throw new ApiError(400, 'Amount is required.');
  }
  if (typeof amount !== 'number' || amount < 0) {
    throw new ApiError(400, 'Amount must be a non-negative number.');
  }
  if (!method || !method.trim()) {
    throw new ApiError(400, 'Payment method is required.');
  }

  // Validate paid_at if provided
  if (paid_at !== undefined && paid_at !== null) {
    const parsedDate = new Date(paid_at);
    if (isNaN(parsedDate.getTime())) {
      throw new ApiError(400, 'paid_at must be a valid date.');
    }
  }

  // bill_id from URL param, paid_by from authenticated user — never from client
  const paymentData = {
    bill_id: bill._id,
    paid_by: req.user._id,
    amount,
    method: method.trim(),
  };

  if (transaction_id !== undefined) {
    paymentData.transaction_id = transaction_id;
  }

  if (paid_at !== undefined && paid_at !== null) {
    paymentData.paid_at = new Date(paid_at);
  }

  const payment = await Payment.create(paymentData);

  return created(res, 'Payment created successfully.', { payment });
});

// ─────────────────────────────────────────────
// GET /api/spaces/:spaceId/bills/:billId/payments
// ─────────────────────────────────────────────
const getPayments = catchAsync(async (req, res) => {
  const bill = await verifyBill(req.params.billId, req.space);

  const payments = await Payment.find({ bill_id: bill._id })
    .populate('paid_by', 'name email phone')
    .sort({ paid_at: -1 });

  return ok(res, 'Payments retrieved successfully.', { payments });
});

// ─────────────────────────────────────────────
// GET /api/spaces/:spaceId/bills/:billId/payments/:paymentId
// ─────────────────────────────────────────────
const getPayment = catchAsync(async (req, res) => {
  const bill = await verifyBill(req.params.billId, req.space);
  const { paymentId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(paymentId)) {
    throw new ApiError(400, 'Invalid payment ID.');
  }

  const payment = await Payment.findOne({
    _id: paymentId,
    bill_id: bill._id,
  }).populate('paid_by', 'name email phone');

  if (!payment) {
    throw new ApiError(404, 'Payment not found for this bill.');
  }

  return ok(res, 'Payment retrieved successfully.', { payment });
});

// ─────────────────────────────────────────────
// PATCH /api/spaces/:spaceId/bills/:billId/payments/:paymentId
// ─────────────────────────────────────────────
const updatePayment = catchAsync(async (req, res) => {
  const bill = await verifyBill(req.params.billId, req.space);
  const { paymentId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(paymentId)) {
    throw new ApiError(400, 'Invalid payment ID.');
  }

  const payment = await Payment.findOne({
    _id: paymentId,
    bill_id: bill._id,
  });

  if (!payment) {
    throw new ApiError(404, 'Payment not found for this bill.');
  }

  // Only allow updatable fields — never bill_id or paid_by
  const { amount, method, transaction_id, paid_at } = req.body;

  if (amount !== undefined) {
    if (typeof amount !== 'number' || amount < 0) {
      throw new ApiError(400, 'Amount must be a non-negative number.');
    }
    payment.amount = amount;
  }

  if (method !== undefined) {
    if (!method.trim()) {
      throw new ApiError(400, 'Payment method cannot be empty.');
    }
    payment.method = method.trim();
  }

  if (transaction_id !== undefined) {
    payment.transaction_id = transaction_id;
  }

  if (paid_at !== undefined) {
    if (paid_at === null) {
      payment.paid_at = null;
    } else {
      const parsedDate = new Date(paid_at);
      if (isNaN(parsedDate.getTime())) {
        throw new ApiError(400, 'paid_at must be a valid date.');
      }
      payment.paid_at = parsedDate;
    }
  }

  await payment.save();

  return ok(res, 'Payment updated successfully.', { payment });
});

// ─────────────────────────────────────────────
// DELETE /api/spaces/:spaceId/bills/:billId/payments/:paymentId
// ─────────────────────────────────────────────
const deletePayment = catchAsync(async (req, res) => {
  const bill = await verifyBill(req.params.billId, req.space);
  const { paymentId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(paymentId)) {
    throw new ApiError(400, 'Invalid payment ID.');
  }

  const payment = await Payment.findOne({
    _id: paymentId,
    bill_id: bill._id,
  });

  if (!payment) {
    throw new ApiError(404, 'Payment not found for this bill.');
  }

  await Payment.findByIdAndDelete(payment._id);

  return ok(res, 'Payment deleted successfully.');
});

module.exports = { createPayment, getPayments, getPayment, updatePayment, deletePayment };
