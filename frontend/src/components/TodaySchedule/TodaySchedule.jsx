import styles from './TodaySchedule.module.css';

const ICON_MAP = {
  visitor: '👤',
  chore: '🧹',
  payment: '💸',
};

export default function TodaySchedule({ schedule }) {
  if (!schedule || schedule.length === 0) {
    return (
      <section className={styles.section}>
        <h2 className={styles.title}>Today</h2>
        <div className={styles.emptyState}>
          No events scheduled for today.
        </div>
      </section>
    );
  }

  return (
    <section className={styles.section} aria-label="Today's Schedule">
      <h2 className={styles.title}>Today</h2>
      <div className={styles.list}>
        {schedule.map(item => (
          <div key={item.id} className={styles.item}>
            <div className={styles.timeCol}>
              <span className={styles.time}>{item.time}</span>
            </div>
            <div className={styles.divider}>
              <div className={styles.node}>{ICON_MAP[item.type] || '•'}</div>
              <div className={styles.line} />
            </div>
            <div className={styles.contentCol}>
              <h4 className={styles.itemTitle}>{item.title}</h4>
              <p className={styles.itemDetail}>{item.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
