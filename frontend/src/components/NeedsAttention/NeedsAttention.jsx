import styles from './NeedsAttention.module.css';
import { useToast } from '../../contexts/ToastContext';

const ATTN_ICONS = {
  overdue: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  ),
  bills: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  ),
  complaint: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  chores: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 11 12 14 22 4" />
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </svg>
  ),
};

export default function NeedsAttention({ items }) {
  const { showToast } = useToast();
  if (!items || items.length === 0) {
    return (
      <section className={styles.section}>
        <h2 className={styles.title}>Needs Attention</h2>
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>🎉</div>
          <p>All caught up! Nothing urgent requires your attention.</p>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.section} aria-label="Urgent items needing attention">
      <h2 className={styles.title}>Needs Attention</h2>
      <div className={styles.grid}>
        {items.map((item) => (
          <div key={item.id} className={`${styles.card} ${styles[item.severity] || ''}`}>
            <div className={styles.iconWrap} aria-hidden="true">
              {ATTN_ICONS[item.type]}
            </div>
            <div className={styles.content}>
              <h3 className={styles.itemTitle}>{item.title}</h3>
              <p className={styles.itemDesc}>{item.description}</p>
            </div>
            <button 
              className={styles.actionBtn}
              onClick={() => showToast(
                item.type === 'overdue' ? 'Reminder sent' : `Reviewing: ${item.title}`,
                item.type === 'overdue' ? 'success' : 'info'
              )}
            >
              {item.type === 'overdue' ? 'Send Reminder' : 'Review'}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
