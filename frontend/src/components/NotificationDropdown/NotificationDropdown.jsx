/**
 * NotificationDropdown.jsx
 * Small dropdown panel showing real notifications from the API.
 * Rendered from Topbar on bell click.
 *
 * ⚠️ Falls back to empty state when notification API is unavailable
 *    (routes not yet mounted in backend server.js).
 */
import { useEffect, useRef, useState, useCallback } from 'react';
import { getNotifications, markAsRead } from '../../services/notificationService';
import styles from './NotificationDropdown.module.css';

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

export default function NotificationDropdown({ open, onClose }) {
  const panelRef = useRef(null);
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchNotifications = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getNotifications();
      setNotifications(Array.isArray(data) ? data.slice(0, 8) : []);
    } catch {
      // Silently fail — notifications may not be available yet
      setNotifications([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch when dropdown opens
  useEffect(() => {
    if (open) {
      fetchNotifications();
    }
  }, [open, fetchNotifications]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    function handleClick(e) {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        onClose();
      }
    }
    // Delay listener to avoid catching the opening click
    const id = setTimeout(() => document.addEventListener('mousedown', handleClick), 0);
    return () => {
      clearTimeout(id);
      document.removeEventListener('mousedown', handleClick);
    };
  }, [open, onClose]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    function handleKey(e) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  const handleMarkRead = async (id) => {
    try {
      await markAsRead(id);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, is_read: true } : n));
    } catch {
      // Silently fail
    }
  };

  if (!open) return null;

  const unread = notifications.filter((n) => !n.is_read).length;

  return (
    <div className={styles.dropdown} ref={panelRef} role="menu" aria-label="Notifications">
      <div className={styles.header}>
        <span className={styles.title}>Notifications</span>
        {unread > 0 && <span className={styles.unreadBadge}>{unread} new</span>}
      </div>
      <ul className={styles.list} role="list">
        {isLoading ? (
          <li className={styles.item} style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>
            Loading…
          </li>
        ) : notifications.length === 0 ? (
          <li className={styles.item} style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>
            No notifications
          </li>
        ) : (
          notifications.map((notif) => (
            <li
              key={notif._id}
              className={[styles.item, !notif.is_read ? styles.itemUnread : ''].join(' ')}
              onClick={() => !notif.is_read && handleMarkRead(notif._id)}
              style={{ cursor: !notif.is_read ? 'pointer' : 'default' }}
            >
              {!notif.is_read && <span className={styles.dot} aria-hidden="true" />}
              <div className={styles.content}>
                <p className={styles.itemTitle}>{notif.title}</p>
                <p className={styles.itemBody}>{notif.message}</p>
                <p className={styles.itemTime}>{formatTime(notif.created_at)}</p>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
