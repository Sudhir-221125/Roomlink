const mongoose = require('mongoose');
const Notification = require('../models/Notification');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { ok } = require('../utils/apiResponse');

// ─────────────────────────────────────────────
// GET /api/notifications
// ─────────────────────────────────────────────
const getNotifications = catchAsync(async (req, res) => {
  const notifications = await Notification.find({ user_id: req.user._id })
    .sort({ created_at: -1 });

  return ok(res, 'Notifications retrieved successfully.', { notifications });
});

// ─────────────────────────────────────────────
// GET /api/notifications/:notificationId
// ─────────────────────────────────────────────
const getNotification = catchAsync(async (req, res) => {
  const { notificationId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(notificationId)) {
    throw new ApiError(400, 'Invalid notification ID.');
  }

  const notification = await Notification.findOne({
    _id: notificationId,
    user_id: req.user._id,
  });

  if (!notification) {
    throw new ApiError(404, 'Notification not found.');
  }

  return ok(res, 'Notification retrieved successfully.', { notification });
});

// ─────────────────────────────────────────────
// PATCH /api/notifications/:notificationId/read
// ─────────────────────────────────────────────
const markAsRead = catchAsync(async (req, res) => {
  const { notificationId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(notificationId)) {
    throw new ApiError(400, 'Invalid notification ID.');
  }

  const notification = await Notification.findOne({
    _id: notificationId,
    user_id: req.user._id,
  });

  if (!notification) {
    throw new ApiError(404, 'Notification not found.');
  }

  notification.is_read = true;
  await notification.save();

  return ok(res, 'Notification marked as read.', { notification });
});

// ─────────────────────────────────────────────
// PATCH /api/notifications/read-all
// ─────────────────────────────────────────────
const markAllAsRead = catchAsync(async (req, res) => {
  const result = await Notification.updateMany(
    { user_id: req.user._id, is_read: false },
    { $set: { is_read: true } }
  );

  return ok(res, 'All notifications marked as read.', {
    modifiedCount: result.modifiedCount,
  });
});

// ─────────────────────────────────────────────
// DELETE /api/notifications/:notificationId
// ─────────────────────────────────────────────
const deleteNotification = catchAsync(async (req, res) => {
  const { notificationId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(notificationId)) {
    throw new ApiError(400, 'Invalid notification ID.');
  }

  const notification = await Notification.findOne({
    _id: notificationId,
    user_id: req.user._id,
  });

  if (!notification) {
    throw new ApiError(404, 'Notification not found.');
  }

  await Notification.findByIdAndDelete(notification._id);

  return ok(res, 'Notification deleted successfully.');
});

module.exports = { getNotifications, getNotification, markAsRead, markAllAsRead, deleteNotification };
