import { useState } from 'react';
import styles from './NotificationsPage.module.css';
import Tabs from '../../components/common/Tabs';
import EmptyState from '../../components/common/EmptyState';

const INITIAL_NOTIFICATIONS = [
  { id: 'n1', title: 'Rent Payment Due', message: 'Your rent payment of $800 is due in 3 days.', category: 'Rent', date: '2023-10-25 10:00', read: false },
  { id: 'n2', title: 'New Chore Assigned', message: 'You have been assigned to "Take out the trash".', category: 'Chores', date: '2023-10-24 14:30', read: false },
  { id: 'n3', title: 'Maintenance Update', message: 'The leaking faucet in bathroom has been resolved.', category: 'System', date: '2023-10-23 09:15', read: true },
  { id: 'n4', title: 'Guest Arrival', message: 'Your guest John Doe is expected to arrive today.', category: 'System', date: '2023-10-22 08:00', read: true },
  { id: 'n5', title: 'New Bill Added', message: 'A new electricity bill for $150 has been added.', category: 'Bills', date: '2023-10-20 11:20', read: true },
];

const TABS = [
  { id: 'all', label: 'All Notifications' },
  { id: 'unread', label: 'Unread' },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [activeTab, setActiveTab] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const filteredNotifications = notifications.filter(notif => {
    if (activeTab === 'unread' && notif.read) return false;
    if (categoryFilter !== 'All' && notif.category !== categoryFilter) return false;
    return true;
  });

  const markAsRead = (id) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Rent': return '💰';
      case 'Chores': return '🧹';
      case 'Bills': return '📄';
      case 'System': return '🔔';
      default: return '✉️';
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Notifications</h1>
          <p className={styles.subtitle}>Stay updated on what's happening.</p>
        </div>
        <button className={styles.secondaryButton} onClick={markAllAsRead}>
          Mark all as read
        </button>
      </header>

      <Tabs tabs={TABS} activeTab={activeTab} onChange={(tab) => {
        setActiveTab(tab);
        setCategoryFilter('All');
      }} />

      <div className={styles.controls}>
        <select 
          value={categoryFilter} 
          onChange={(e) => setCategoryFilter(e.target.value)}
          className={styles.filterSelect}
        >
          <option value="All">All Categories</option>
          <option value="Rent">Rent</option>
          <option value="Bills">Bills</option>
          <option value="Chores">Chores</option>
          <option value="System">System</option>
        </select>
      </div>

      <div className={styles.content}>
        {filteredNotifications.length > 0 ? (
          <div className={styles.list}>
            {filteredNotifications.map(notif => (
              <div key={notif.id} className={`${styles.notifItem} ${notif.read ? styles.read : styles.unread}`}>
                <div className={styles.notifIcon}>
                  {getCategoryIcon(notif.category)}
                </div>
                <div className={styles.notifContent}>
                  <div className={styles.notifHeader}>
                    <h3 className={styles.notifTitle}>{notif.title}</h3>
                    <span className={styles.notifDate}>{notif.date}</span>
                  </div>
                  <p className={styles.notifMessage}>{notif.message}</p>
                </div>
                {!notif.read && (
                  <button 
                    className={styles.markReadButton} 
                    onClick={() => markAsRead(notif.id)}
                    title="Mark as read"
                  >
                    ✓
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <EmptyState 
            title="All caught up!" 
            description="You don't have any notifications here." 
          />
        )}
      </div>
    </div>
  );
}
