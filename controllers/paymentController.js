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

/**
 * Recalculate bill status based on verified payments
 */
const recalculateBillStatus = async (billId) => {
  const bill = await Bill.findById(billId);
  if (!bill) return;

  const verifiedPayments = await Payment.find({ bill_id: billId, status: 'verified' });
  const totalPaid = verifiedPayments.reduce((sum, p) => sum + p.amount, 0);

  if (totalPaid >= bill.amount) {
    bill.status = 'paid';
  } else if (totalPaid > 0) {
    bill.status = 'partial';
  } else {
    bill.status = 'unpaid';
  }
  
  await bill.save();
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
  
  const allowedMethods = ['upi', 'bank_transfer', 'cash'];
  if (!method || !allowedMethods.includes(method.trim())) {
    throw new ApiError(400, `Payment method must be one of: ${allowedMethods.join(', ')}.`);
  }

  const cleanMethod = method.trim();
  let finalTransactionId = transaction_id;

  if (cleanMethod === 'upi') {
    if (!transaction_id || !/^\d{12}$/.test(transaction_id)) {
      throw new ApiError(400, 'UPI payments require a 12-digit numeric transaction ID (RRN).');
    }
    finalTransactionId = transaction_id;
  } else if (cleanMethod === 'bank_transfer') {
    if (!transaction_id || !transaction_id.trim()) {
      throw new ApiError(400, 'Bank transfers require a transaction ID.');
    }
    finalTransactionId = transaction_id.trim();
  } else if (cleanMethod === 'cash') {
    finalTransactionId = transaction_id ? transaction_id.trim() : null;
  }

  // Prevent overpayment
  const existingPayments = await Payment.find({ bill_id: bill._id, status: 'verified' });
  const totalPaid = existingPayments.reduce((sum, p) => sum + p.amount, 0);
  if (totalPaid + amount > bill.amount) {
    throw new ApiError(400, `Payment amount exceeds the remaining bill balance. Remaining: ${bill.amount - totalPaid}`);
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
    method: cleanMethod,
    status: 'pending_verification',
  };

  if (finalTransactionId !== undefined && finalTransactionId !== null) {
    paymentData.transaction_id = finalTransactionId;
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
  const { amount, method, transaction_id, paid_at, status } = req.body;

  let hasStatusChanged = false;

  if (amount !== undefined) {
    if (typeof amount !== 'number' || amount < 0) {
      throw new ApiError(400, 'Amount must be a non-negative number.');
    }
    payment.amount = amount;
    hasStatusChanged = true; // Recalculate bill status if amount changes
  }

  if (method !== undefined) {
    const allowedMethods = ['upi', 'bank_transfer', 'cash'];
    if (!allowedMethods.includes(method.trim())) {
      throw new ApiError(400, `Payment method must be one of: ${allowedMethods.join(', ')}.`);
    }
    payment.method = method.trim();
  }

  if (transaction_id !== undefined) {
    payment.transaction_id = transaction_id;
  }

  if (payment.method === 'upi' && payment.transaction_id && !/^\d{12}$/.test(payment.transaction_id)) {
    throw new ApiError(400, 'UPI payments require a 12-digit numeric transaction ID (RRN).');
  } else if (payment.method === 'bank_transfer' && !payment.transaction_id) {
    throw new ApiError(400, 'Bank transfers require a transaction ID.');
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

  if (status !== undefined) {
    const allowedStatuses = ['pending_verification', 'verified', 'failed'];
    if (!allowedStatuses.includes(status)) {
      throw new ApiError(400, `Payment status must be one of: ${allowedStatuses.join(', ')}.`);
    }
    
    // Prevent overpayment on verification
    if (status === 'verified' && payment.status !== 'verified') {
      const existingPayments = await Payment.find({ bill_id: bill._id, status: 'verified', _id: { $ne: payment._id } });
      const totalPaid = existingPayments.reduce((sum, p) => sum + p.amount, 0);
      if (totalPaid + payment.amount > bill.amount) {
        throw new ApiError(400, `Verifying this payment exceeds the remaining bill balance. Remaining: ${bill.amount - totalPaid}`);
      }
    }
    
    payment.status = status;
    hasStatusChanged = true;
  }

  await payment.save();

  if (hasStatusChanged) {
    await recalculateBillStatus(bill._id);
  }

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

  const wasVerified = payment.status === 'verified';
  
  await Payment.findByIdAndDelete(payment._id);

  if (wasVerified) {
    await recalculateBillStatus(bill._id);
  }

  return ok(res, 'Payment deleted successfully.');
});

module.exports = { createPayment, getPayments, getPayment, updatePayment, deletePayment };
