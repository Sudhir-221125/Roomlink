/**
 * AuthLayout.jsx
 * Split-screen layout for authentication pages.
 * Left: Auth form container
 * Right: Visual graphic (hidden on mobile)
 */
import styles from './AuthLayout.module.css';

export default function AuthLayout({ children }) {
  return (
    <div className={styles.container}>
      {/* Form Side */}
      <div className={styles.formSide}>
        <div className={styles.formWrapper}>
          {children}
        </div>
      </div>

      {/* Visual Side */}
      <div className={styles.visualSide} aria-hidden="true">
        <div className={styles.visualContent}>
          <div className={styles.brandBadge}>
            <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" width="32" height="32">
              <rect width="32" height="32" rx="8" fill="var(--color-primary)" />
              <path d="M7 22V13l9-7 9 7v9" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <rect x="13" y="16" width="6" height="6" rx="1" fill="#fff" fillOpacity="0.85" />
            </svg>
            <span>RoomLink</span>
          </div>
          <h2>Harmony in shared spaces.</h2>
          <p>Join thousands of communities managing their living spaces intelligently.</p>
          
          {/* Abstract Grid Graphic */}
          <div className={styles.abstractGraphic}>
            <div className={styles.agBlock} style={{ width: '40%', height: '40px' }} />
            <div className={styles.agBlock} style={{ width: '60%', height: '80px', background: 'var(--brand-300)' }} />
            <div className={styles.agBlock} style={{ width: '100%', height: '200px', background: 'var(--brand-500)' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
