/**
 * notificationService.js
 * Wraps the RoomLink Notifications API.
 *
 * Real endpoints:
 *   GET    /api/notifications                          — list user's notifications
 *   GET    /api/notifications/:notificationId          — get single notification
 *   PATCH  /api/notifications/:notificationId/read     — mark one as read
 *   PATCH  /api/notifications/read-all                 — mark all as read
 *   DELETE /api/notifications/:notificationId          — delete notification
 *
 * Notification model fields: user_id, type, title, message, is_read, created_at
 *
 * ⚠️  NOTE: The notification routes are NOT yet mounted in the backend's server.js.
 * These calls will return 404 until the backend adds:
 *   app.use('/api/notifications', require('./routes/notificationRoutes'));
 */
import api from './api.js';

/**
 * Get all notifications for the current user.
 * GET /api/notifications
 * Returns: { notifications: Notification[] }
 */
export async function getNotifications() {
  const data = await api.get('/notifications');
  return data?.notifications || data || [];
}

/**
 * Get a single notification.
 * GET /api/notifications/:notificationId
 * Returns: { notification: Notification }
 */
export async function getNotification(notificationId) {
  const data = await api.get(`/notifications/${notificationId}`);
  return data?.notification || data;
}

/**
 * Mark a notification as read.
 * PATCH /api/notifications/:notificationId/read
 * Returns: { notification: Notification }
 */
export async function markAsRead(notificationId) {
  const data = await api.patch(`/notifications/${notificationId}/read`, {});
  return data?.notification || data;
}

/**
 * Mark all notifications as read.
 * PATCH /api/notifications/read-all
 * Returns: { modifiedCount: number }
 */
export async function markAllAsRead() {
  const data = await api.patch('/notifications/read-all', {});
  return data;
}

/**
 * Delete a notification.
 * DELETE /api/notifications/:notificationId
 */
export async function deleteNotification(notificationId) {
  return api.delete(`/notifications/${notificationId}`);
}
