/**
 * UpcomingReminders.jsx
 * Small widget listing upcoming reminders / deadlines.
 * Supports adding new reminders via parent callback.
 */
import styles from './UpcomingReminders.module.css';

const COLOR_CLASS = {
  brand:   styles.colorBrand,
  warning: styles.colorWarning,
  success: styles.colorSuccess,
};

export default function UpcomingReminders({ reminders, onAddClick }) {
  return (
    <section className={styles.section} aria-label="Upcoming reminders">
      <div className={styles.header}>
        <h2 className={styles.title}>Upcoming Reminders</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <span className={styles.count}>{reminders.length}</span>
          {onAddClick && (
            <button
              className={styles.addBtn}
              onClick={onAddClick}
              aria-label="Add reminder"
              title="Add reminder"
            >
              +
            </button>
          )}
        </div>
      </div>

      <ul className={styles.list} role="list">
        {reminders.map((r) => (
          <li key={r.id} className={styles.item}>
            <span className={[styles.dot, COLOR_CLASS[r.color] || ''].join(' ')} aria-hidden="true" />
            <div className={styles.info}>
              <p className={styles.remTitle}>{r.title}</p>
              <p className={styles.remDate}>{r.date}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

