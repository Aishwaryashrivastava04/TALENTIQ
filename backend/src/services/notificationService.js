/**
 * Notification Service
 * Manages real-time event notifications for candidates, HR managers, and administrators.
 * Dual store: In-Memory cache + MySQL persistence.
 */

const { mysqlPool } = require('../config/db');

// In-Memory store for instant zero-latency retrieval
const IN_MEMORY_NOTIFICATIONS = [
  {
    id: 1,
    user_id: null, // broadcast to all HR/Admin
    type: 'NEW_JOB',
    title: 'New Requisition Published',
    message: 'Senior Full-Stack Developer (JOB-201) requisition is active with ₹9-16 LPA budget.',
    link: 'jobs',
    is_read: false,
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 2,
    user_id: 1, // Admin (Aishwarya Shree)
    type: 'INTERVIEW_SCHEDULED',
    title: 'Technical Round 1 Scheduled',
    message: 'Rahul Verma has been confirmed for Technical Evaluation on React & Node.js microservices.',
    link: 'interviews',
    is_read: false,
    created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: 3,
    user_id: null,
    type: 'APPLICATION_SUBMITTED',
    title: 'New Candidate Application',
    message: 'Divya Nair submitted application for AI & Data Platform Engineer (Match Score: 94%).',
    link: 'applications',
    is_read: true,
    created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
  {
    id: 4,
    user_id: 1,
    type: 'ACCOUNT_VERIFIED',
    title: 'Security Verification Completed',
    message: 'Master Administrator credentials verified for Aishwarya Shree (AS).',
    link: 'account-settings',
    is_read: true,
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  {
    id: 5,
    user_id: null,
    type: 'INTERVIEW_REMINDER',
    title: 'Interview Reminder',
    message: 'Upcoming Technical Round with Rohan Kulkarni scheduled for tomorrow at 2:00 PM IST.',
    link: 'interviews',
    is_read: false,
    created_at: new Date(Date.now() - 3600000 * 6).toISOString(),
  }
];

let nextNotificationId = 100;

/**
 * Ensure MySQL notifications table exists
 */
async function ensureNotificationTable() {
  try {
    await mysqlPool.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NULL,
        type VARCHAR(50) NOT NULL,
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        link VARCHAR(255) NULL,
        is_read BOOLEAN NOT NULL DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_notif_user (user_id),
        INDEX idx_notif_read (is_read)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
  } catch (err) {
    // MySQL may be offline in sandbox
  }
}

/**
 * Create a new notification event
 */
async function createNotification({ user_id = null, type, title, message, link = null }) {
  const notif = {
    id: ++nextNotificationId,
    user_id: user_id ? Number(user_id) : null,
    type: type || 'SYSTEM',
    title: title || 'System Notification',
    message: message || '',
    link: link || null,
    is_read: false,
    created_at: new Date().toISOString()
  };

  IN_MEMORY_NOTIFICATIONS.unshift(notif);

  try {
    await mysqlPool.query(
      `INSERT INTO notifications (user_id, type, title, message, link, is_read) VALUES (?, ?, ?, ?, ?, FALSE)`,
      [notif.user_id, notif.type, notif.title, notif.message, notif.link]
    );
  } catch (err) {
    // MySQL query warning ignored (in-memory cache preserved)
  }

  return notif;
}

/**
 * Retrieve notifications for current user or all system notifications
 */
async function getNotifications(userId = null) {
  try {
    const [rows] = await mysqlPool.query(`
      SELECT id, user_id, type, title, message, link, is_read, created_at
      FROM notifications
      WHERE user_id IS NULL OR user_id = ?
      ORDER BY created_at DESC
      LIMIT 50
    `, [userId]);

    if (rows && rows.length > 0) {
      return rows.map(r => ({
        ...r,
        is_read: Boolean(r.is_read),
        created_at: new Date(r.created_at).toISOString()
      }));
    }
  } catch (err) {
    // Fallback to in-memory
  }

  return IN_MEMORY_NOTIFICATIONS.filter(n => n.user_id === null || !userId || n.user_id === Number(userId));
}

/**
 * Mark a single notification as read
 */
async function markNotificationAsRead(id) {
  const numId = Number(id);
  const target = IN_MEMORY_NOTIFICATIONS.find(n => n.id === numId);
  if (target) {
    target.is_read = true;
  }

  try {
    await mysqlPool.query('UPDATE notifications SET is_read = TRUE WHERE id = ?', [numId]);
  } catch (err) {
    // ignore
  }

  return { success: true, id: numId };
}

/**
 * Mark all notifications as read
 */
async function markAllNotificationsAsRead(userId = null) {
  IN_MEMORY_NOTIFICATIONS.forEach(n => {
    if (!userId || n.user_id === null || n.user_id === Number(userId)) {
      n.is_read = true;
    }
  });

  try {
    if (userId) {
      await mysqlPool.query('UPDATE notifications SET is_read = TRUE WHERE user_id IS NULL OR user_id = ?', [userId]);
    } else {
      await mysqlPool.query('UPDATE notifications SET is_read = TRUE');
    }
  } catch (err) {
    // ignore
  }

  return { success: true };
}

module.exports = {
  ensureNotificationTable,
  createNotification,
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
};
