const mongoose = require('mongoose');
const Bill = require('../models/Bill');
const Payment = require('../models/Payment');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { ok, created } = require('../utils/apiResponse');

// ─────────────────────────────────────────────
// POST /api/spaces/:spaceId/bills
// ─────────────────────────────────────────────
const createBill = catchAsync(async (req, res) => {
  const { title, amount, due_date } = req.body;

  // Validate required fields
  if (!title) {
    throw new ApiError(400, 'Title is required.');
  }
  if (amount === undefined || amount === null) {
    throw new ApiError(400, 'Amount is required.');
  }
  if (typeof amount !== 'number' || amount < 0) {
    throw new ApiError(400, 'Amount must be a non-negative number.');
  }
  if (!due_date) {
    throw new ApiError(400, 'Due date is required.');
  }

  const parsedDate = new Date(due_date);
  if (isNaN(parsedDate.getTime())) {
    throw new ApiError(400, 'Due date must be a valid date.');
  }

  // space_id from URL param, created_by from authenticated user — never from client
  const bill = await Bill.create({
    space_id: req.space._id,
    title,
    amount,
    due_date: parsedDate,
    created_by: req.user._id,
  });

  return created(res, 'Bill created successfully.', { bill });
});

// ─────────────────────────────────────────────
// GET /api/spaces/:spaceId/bills
// ─────────────────────────────────────────────
const getBills = catchAsync(async (req, res) => {
  const bills = await Bill.find({ space_id: req.space._id })
    .populate('created_by', 'name email')
    .sort({ due_date: 1 });

  return ok(res, 'Bills retrieved successfully.', { bills });
});

// ─────────────────────────────────────────────
// GET /api/spaces/:spaceId/bills/:billId
// ─────────────────────────────────────────────
const getBill = catchAsync(async (req, res) => {
  const { billId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(billId)) {
    throw new ApiError(400, 'Invalid bill ID.');
  }

  const bill = await Bill.findOne({
    _id: billId,
    space_id: req.space._id,
  }).populate('created_by', 'name email');

  if (!bill) {
    throw new ApiError(404, 'Bill not found in this space.');
  }

  return ok(res, 'Bill retrieved successfully.', { bill });
});

// ─────────────────────────────────────────────
// PATCH /api/spaces/:spaceId/bills/:billId
// ─────────────────────────────────────────────
const updateBill = catchAsync(async (req, res) => {
  const { billId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(billId)) {
    throw new ApiError(400, 'Invalid bill ID.');
  }

  const bill = await Bill.findOne({
    _id: billId,
    space_id: req.space._id,
  });

  if (!bill) {
    throw new ApiError(404, 'Bill not found in this space.');
  }

  // Only allow updatable fields — never space_id or created_by
  const { title, amount, due_date } = req.body;

  if (title !== undefined) bill.title = title;

  if (amount !== undefined) {
    if (typeof amount !== 'number' || amount < 0) {
      throw new ApiError(400, 'Amount must be a non-negative number.');
    }
    bill.amount = amount;
  }

  if (due_date !== undefined) {
    const parsedDate = new Date(due_date);
    if (isNaN(parsedDate.getTime())) {
      throw new ApiError(400, 'Due date must be a valid date.');
    }
    bill.due_date = parsedDate;
  }

  await bill.save();

  return ok(res, 'Bill updated successfully.', { bill });
});

// ─────────────────────────────────────────────
// DELETE /api/spaces/:spaceId/bills/:billId
// ─────────────────────────────────────────────
const deleteBill = catchAsync(async (req, res) => {
  const { billId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(billId)) {
    throw new ApiError(400, 'Invalid bill ID.');
  }

  const bill = await Bill.findOne({
    _id: billId,
    space_id: req.space._id,
  });

  if (!bill) {
    throw new ApiError(404, 'Bill not found in this space.');
  }

  // Cascade-delete all Payments referencing this bill to avoid orphaned records.
  // Payment.bill_id → Bill._id is the relationship defined in the Payment model.
  await Payment.deleteMany({ bill_id: bill._id });

  await Bill.findByIdAndDelete(bill._id);

  return ok(res, 'Bill and associated payments deleted successfully.');
});

module.exports = { createBill, getBills, getBill, updateBill, deleteBill };
