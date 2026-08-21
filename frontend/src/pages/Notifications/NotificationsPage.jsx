/**
 * NotificationsPage.jsx
 * Displays user's notifications from the real API.
 *
 * Real API:
 *   GET    /api/notifications                          — list
 *   PATCH  /api/notifications/:notificationId/read     — mark as read
 *   PATCH  /api/notifications/read-all                 — mark all as read
 *   DELETE /api/notifications/:notificationId          — delete
 *
 * Notification model: type, title, message, is_read, created_at
 *
 * ⚠️ Notification routes are not yet mounted in backend server.js.
 *    Once mounted, this page will work. Until then, it gracefully shows an empty state.
 */
import { useState, useEffect, useCallback } from 'react';
import styles from './NotificationsPage.module.css';
import Tabs from '../../components/common/Tabs';
import EmptyState from '../../components/common/EmptyState';
import {
  getNotifications,
  markAsRead as apiMarkAsRead,
  markAllAsRead as apiMarkAllAsRead,
  deleteNotification,
} from '../../services/notificationService';
import { useToast } from '../../contexts/ToastContext';

const TABS = [
  { id: 'all', label: 'All Notifications' },
  { id: 'unread', label: 'Unread' },
];

function formatTime(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const now = new Date();
  const diffMs = now - d;
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHrs = Math.floor(diffMins / 60);
  if (diffHrs < 24) return `${diffHrs}h ago`;
  const diffDays = Math.floor(diffHrs / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

const TYPE_ICONS = {
  bill: '💰',
  payment: '💳',
  chore: '🧹',
  complaint: '⚠️',
  membership: '👤',
  space: '🏠',
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const { showToast } = useToast();

  const fetchNotifications = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getNotifications();
      setNotifications(Array.isArray(data) ? data : []);
    } catch (err) {
      // Gracefully handle 404 from unmounted notification routes
      if (err.status === 404) {
        setNotifications([]);
        setError(null); // Don't show error, just empty
      } else {
        setError(err.message || 'Failed to load notifications');
        setNotifications([]);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const filteredNotifications = notifications.filter(notif => {
    if (activeTab === 'unread' && notif.is_read) return false;
    return true;
  });

  const handleMarkAsRead = async (id) => {
    try {
      await apiMarkAsRead(id);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, is_read: true } : n));
    } catch (err) {
      showToast(err.message || 'Failed to mark as read', 'error');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await apiMarkAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      showToast('All notifications marked as read', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to mark all as read', 'error');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteNotification(id);
      setNotifications(prev => prev.filter(n => n._id !== id));
      showToast('Notification deleted', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to delete notification', 'error');
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Notifications</h1>
          <p className={styles.subtitle}>Stay updated on what's happening.</p>
        </div>
        {notifications.some(n => !n.is_read) && (
          <button className={styles.secondaryButton} onClick={handleMarkAllAsRead}>
            Mark all as read
          </button>
        )}
      </header>

      <Tabs tabs={TABS} activeTab={activeTab} onChange={(tab) => setActiveTab(tab)} />

      <div className={styles.content}>
        {isLoading ? (
          <div style={{ padding: 'var(--space-8)', textAlign: 'center', color: 'var(--color-text-muted)' }}>
            Loading notifications…
          </div>
        ) : error ? (
          <div style={{ padding: 'var(--space-8)', textAlign: 'center', color: 'var(--color-danger)' }}>
            {error}
          </div>
        ) : filteredNotifications.length > 0 ? (
          <div className={styles.list}>
            {filteredNotifications.map(notif => (
              <div key={notif._id} className={`${styles.notifItem} ${notif.is_read ? styles.read : styles.unread}`}>
                <div className={styles.notifIcon}>
                  {TYPE_ICONS[notif.type] || '🔔'}
                </div>
                <div className={styles.notifContent}>
                  <div className={styles.notifHeader}>
                    <h3 className={styles.notifTitle}>{notif.title}</h3>
                    <span className={styles.notifDate}>{formatTime(notif.created_at)}</span>
                  </div>
                  <p className={styles.notifMessage}>{notif.message}</p>
                </div>
                <div style={{ display: 'flex', gap: '0.25rem', flexShrink: 0 }}>
                  {!notif.is_read && (
                    <button
                      className={styles.markReadButton}
                      onClick={() => handleMarkAsRead(notif._id)}
                      title="Mark as read"
                    >
                      ✓
                    </button>
                  )}
                  <button
                    className={styles.markReadButton}
                    onClick={() => handleDelete(notif._id)}
                    title="Delete"
                    style={{ color: 'var(--color-text-muted)' }}
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="All caught up!"
            description={activeTab === 'unread' ? "You don't have any unread notifications." : "You don't have any notifications yet."}
          />
        )}
      </div>
    </div>
  );
}
