/**
 * NotificationDropdown.jsx
 * Small dropdown panel showing mock notifications.
 * Rendered from Topbar on bell click.
 */
import { useEffect, useRef } from 'react';
import { mockNotifications } from '../../services/mockData';
import styles from './NotificationDropdown.module.css';

export default function NotificationDropdown({ open, onClose }) {
  const panelRef = useRef(null);

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

  if (!open) return null;

  const unread = mockNotifications.filter((n) => !n.read).length;

  return (
    <div className={styles.dropdown} ref={panelRef} role="menu" aria-label="Notifications">
      <div className={styles.header}>
        <span className={styles.title}>Notifications</span>
        {unread > 0 && <span className={styles.unreadBadge}>{unread} new</span>}
      </div>
      <ul className={styles.list} role="list">
        {mockNotifications.map((notif) => (
          <li
            key={notif.id}
            className={[styles.item, !notif.read ? styles.itemUnread : ''].join(' ')}
          >
            {!notif.read && <span className={styles.dot} aria-hidden="true" />}
            <div className={styles.content}>
              <p className={styles.itemTitle}>{notif.title}</p>
              <p className={styles.itemBody}>{notif.body}</p>
              <p className={styles.itemTime}>{notif.time}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
