const express = require('express');
const { protect } = require('../middleware/auth');
const {
  getNotifications,
  getNotification,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} = require('../controllers/notificationController');

const router = express.Router();

// All notification routes require authentication
router.use(protect);

// PATCH /api/notifications/read-all — mark all as read (must be before /:notificationId)
router.patch('/read-all', markAllAsRead);

// GET /api/notifications — list user's notifications
router.get('/', getNotifications);

// GET /api/notifications/:notificationId — get single notification
router.get('/:notificationId', getNotification);

// PATCH /api/notifications/:notificationId/read — mark one as read
router.patch('/:notificationId/read', markAsRead);

// DELETE /api/notifications/:notificationId — delete notification
router.delete('/:notificationId', deleteNotification);

module.exports = router;
