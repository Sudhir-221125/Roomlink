/**
 * StatCard.jsx
 * A single dashboard summary card showing a KPI metric.
 */
import styles from './StatCard.module.css';

// ── Icon map ─────────────────────────────────────────────────────────────────
const ICONS = {
  rent: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <line x1="2" y1="10" x2="22" y2="10" />
    </svg>
  ),
  bills: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="9" y1="13" x2="15" y2="13" />
      <line x1="9" y1="17" x2="13" y2="17" />
    </svg>
  ),
  chores: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 11 12 14 22 4" />
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </svg>
  ),
  complaints: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
};

// color → CSS class map
const COLOR_CLASS = {
  brand:   styles.colorBrand,
  warning: styles.colorWarning,
  danger:  styles.colorDanger,
  info:    styles.colorInfo,
};

export default function StatCard({ label, value, sub, trend, trendUp, icon, color }) {
  return (
    <article className={styles.card} aria-label={`${label}: ${value}`}>
      <div className={styles.cardTop}>
        {/* Icon */}
        <div className={[styles.iconWrap, COLOR_CLASS[color] || ''].join(' ')} aria-hidden="true">
          {ICONS[icon]}
        </div>

        {/* Trend */}
        <div className={[styles.trend, trendUp ? styles.trendUp : styles.trendDown].join(' ')}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
            width="12" height="12" aria-hidden="true">
            {trendUp
              ? <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
              : <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />}
          </svg>
          <span>{trend}</span>
        </div>
      </div>

      {/* Content */}
      <div className={styles.content}>
        <p className={styles.value}>{value}</p>
        <p className={styles.label}>{label}</p>
        <p className={styles.sub}>{sub}</p>
      </div>
    </article>
  );
}
