/**
 * Notification Controller
 * Endpoints for retrieving, marking read, and dispatching event notifications.
 */

const notificationService = require('../services/notificationService');

/**
 * GET /api/notifications
 */
async function getNotifications(req, res, next) {
  try {
    const userId = req.user?.id || null;
    const notifications = await notificationService.getNotifications(userId);
    const unreadCount = notifications.filter(n => !n.is_read).length;

    return res.status(200).json({
      success: true,
      data: notifications,
      unread_count: unreadCount,
      total: notifications.length
    });
  } catch (error) {
    next(error);
  }
}

/**
 * PATCH /api/notifications/:id/read
 */
async function markAsRead(req, res, next) {
  try {
    const { id } = req.params;
    await notificationService.markNotificationAsRead(id);
    return res.status(200).json({
      success: true,
      message: 'Notification marked as read.',
      id: Number(id)
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/notifications/mark-all-read
 */
async function markAllRead(req, res, next) {
  try {
    const userId = req.user?.id || null;
    await notificationService.markAllNotificationsAsRead(userId);
    return res.status(200).json({
      success: true,
      message: 'All notifications marked as read.'
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/notifications (Create a manual/system notification)
 */
async function createNotification(req, res, next) {
  try {
    const { user_id, type, title, message, link } = req.body;
    if (!title || !message) {
      return res.status(400).json({ success: false, message: 'Title and message are required.' });
    }

    const notif = await notificationService.createNotification({
      user_id: user_id || req.user?.id || null,
      type: type || 'SYSTEM',
      title,
      message,
      link
    });

    return res.status(201).json({
      success: true,
      message: 'Notification created successfully.',
      data: notif
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getNotifications,
  markAsRead,
  markAllRead,
  createNotification,
};
