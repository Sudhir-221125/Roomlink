/**
 * ActivityFeed.jsx
 * Lightweight timeline feed.
 */
import styles from './ActivityFeed.module.css';

export default function ActivityFeed({ activities }) {
  if (!activities || activities.length === 0) {
    return (
      <section className={styles.section} aria-label="Recent activity">
        <h2 className={styles.title}>Recent Activity</h2>
        <div className={styles.emptyState}>No recent activity found.</div>
      </section>
    );
  }

  return (
    <section className={styles.section} aria-label="Recent activity">
      <h2 className={styles.title}>Recent Activity</h2>
      
      <div className={styles.timeline}>
        {activities.map((item) => (
          <div key={item.id} className={styles.timelineItem}>
            {/* Left side: Avatar + Vertical line */}
            <div className={styles.timelineNode}>
              <div 
                className={styles.avatar} 
                style={{ background: item.avatarColor }}
              >
                {item.avatar}
              </div>
              <div className={styles.timelineLine} />
            </div>

            {/* Right side: Content */}
            <div className={styles.content}>
              <p className={styles.text}>
                <span className={styles.actor}>{item.actor}</span> {item.message}
              </p>
              <div className={styles.meta}>
                <span className={styles.time}>{item.time}</span>
                <span className={styles.type}>• {item.type}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
