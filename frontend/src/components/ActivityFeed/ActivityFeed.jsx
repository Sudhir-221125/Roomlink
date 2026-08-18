/**
 * ActivityFeed.jsx
 * Recent activity timeline for the Dashboard page.
 */
import styles from './ActivityFeed.module.css';

// Activity type → colour token
const TYPE_COLOR = {
  payment:   'var(--color-success)',
  complaint: 'var(--color-danger)',
  chore:     'var(--brand-500)',
  guest:     'var(--color-info)',
  bill:      'var(--color-warning)',
};

// Activity type → label
const TYPE_LABEL = {
  payment:   'Payment',
  complaint: 'Complaint',
  chore:     'Chore',
  guest:     'Guest',
  bill:      'Bill',
};

export default function ActivityFeed({ activities }) {
  return (
    <section className={styles.section} aria-label="Recent activity">
      <div className={styles.header}>
        <h2 className={styles.title}>Recent Activity</h2>
        <button className={styles.viewAll}>View all</button>
      </div>

      <ul className={styles.list} role="list">
        {activities.map((item) => (
          <li key={item.id} className={styles.item}>
            {/* Avatar */}
            <div
              className={styles.avatar}
              style={{ background: item.avatarColor }}
              aria-hidden="true"
            >
              {item.avatar}
            </div>

            {/* Text */}
            <div className={styles.body}>
              <p className={styles.text}>
                <span className={styles.actor}>{item.actor}</span>{' '}
                {item.message}
              </p>
              <p className={styles.time}>{item.time}</p>
            </div>

            {/* Type pill */}
            <span
              className={styles.typePill}
              style={{
                background: TYPE_COLOR[item.type] + '18',
                color: TYPE_COLOR[item.type],
              }}
            >
              {TYPE_LABEL[item.type]}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
