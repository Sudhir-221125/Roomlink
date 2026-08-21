const Notification = require('../models/Notification');
const Membership = require('../models/Membership');

/**
 * Create a single notification for a user.
 * Fire-and-forget — errors are caught and logged, never thrown.
 *
 * @param {Object} params
 * @param {string} params.user_id  - Target user ObjectId
 * @param {string} params.type     - Notification type (e.g. 'bill', 'chore', 'member')
 * @param {string} params.title    - Short title
 * @param {string} params.message  - Longer description
 */
const createNotification = async ({ user_id, type, title, message }) => {
  try {
    await Notification.create({ user_id, type, title, message });
  } catch (err) {
    console.error('[notifyHelper] Failed to create notification:', err.message);
  }
};

/**
 * Notify all active members of a space, optionally excluding the acting user.
 *
 * @param {string} spaceId        - Space ObjectId
 * @param {string} excludeUserId  - User to exclude (the actor), or null
 * @param {Object} data           - { type, title, message }
 */
const notifySpaceMembers = async (spaceId, excludeUserId, { type, title, message }) => {
  try {
    const query = { space_id: spaceId, is_active: true };
    if (excludeUserId) {
      query.user_id = { $ne: excludeUserId };
    }

    const memberships = await Membership.find(query).select('user_id');

    const notifications = memberships.map((m) => ({
      user_id: m.user_id,
      type,
      title,
      message,
    }));

    if (notifications.length > 0) {
      await Notification.insertMany(notifications);
    }
  } catch (err) {
    console.error('[notifyHelper] Failed to notify space members:', err.message);
  }
};

module.exports = { createNotification, notifySpaceMembers };
