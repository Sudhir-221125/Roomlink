/**
 * PlaceholderPage.jsx
 * Generic "coming soon" page shown for nav items not yet implemented.
 * Renders per-section context so it feels intentional, not blank.
 */
import styles from './PlaceholderPage.module.css';

const PAGE_META = {
  rooms: {
    emoji: '🏠',
    title: 'Rooms & Residents',
    desc: 'Manage all rooms, assign residents, and track occupancy from one place.',
  },
  rent: {
    emoji: '💳',
    title: 'Rent & Payments',
    desc: 'Split rent, track payments, and send automated reminders to residents.',
  },
  bills: {
    emoji: '📄',
    title: 'Bills',
    desc: 'Manage shared utility bills — electricity, water, internet — and split fairly.',
  },
  chores: {
    emoji: '✅',
    title: 'Chores',
    desc: 'Create rotating chore schedules and let residents mark tasks as done.',
  },
  complaints: {
    emoji: '⚠️',
    title: 'Complaints',
    desc: 'Track, assign, and resolve resident complaints with a clear audit trail.',
  },
  guests: {
    emoji: '👥',
    title: 'Guests',
    desc: 'Register and manage guest check-ins and check-outs for your property.',
  },
  settings: {
    emoji: '⚙️',
    title: 'Settings',
    desc: 'Configure your property profile, notification preferences, and user roles.',
  },
};

export default function PlaceholderPage({ page }) {
  const meta = PAGE_META[page] || {
    emoji: '🚧',
    title: 'Coming Soon',
    desc: 'This section is being built. Check back soon!',
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.card}>
        <span className={styles.emoji} aria-hidden="true">{meta.emoji}</span>
        <h1 className={styles.title}>{meta.title}</h1>
        <p className={styles.desc}>{meta.desc}</p>
        <div className={styles.badge}>Coming in next release</div>
      </div>
    </div>
  );
}
