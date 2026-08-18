/**
 * ResidentOverview.jsx
 * Quick-glance table of residents and their current rent status.
 */
import styles from './ResidentOverview.module.css';

const STATUS_CONFIG = {
  paid:    { label: 'Paid',    className: 'statusPaid' },
  pending: { label: 'Pending', className: 'statusPending' },
  overdue: { label: 'Overdue', className: 'statusOverdue' },
};

export default function ResidentOverview({ residents }) {
  return (
    <section className={styles.section} aria-label="Resident overview">
      <div className={styles.header}>
        <h2 className={styles.title}>Residents</h2>
        <button className={styles.viewAll}>View all</button>
      </div>

      <ul className={styles.list} role="list">
        {residents.map((r) => {
          const status = STATUS_CONFIG[r.status] || STATUS_CONFIG.pending;
          return (
            <li key={r.id} className={styles.item}>
              {/* Avatar */}
              <div
                className={styles.avatar}
                style={{ background: r.avatarColor }}
                aria-hidden="true"
              >
                {r.avatar}
              </div>

              {/* Info */}
              <div className={styles.info}>
                <p className={styles.name}>{r.name}</p>
                <p className={styles.room}>{r.room}</p>
              </div>

              {/* Status */}
              <span className={[styles.status, styles[status.className]].join(' ')}>
                {status.label}
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
