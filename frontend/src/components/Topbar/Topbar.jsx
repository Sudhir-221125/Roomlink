/**
 * Topbar.jsx
 * Top navigation bar — shows page title, search, and notification/user controls.
 */
import styles from './Topbar.module.css';

export default function Topbar({ pageTitle, onMenuToggle }) {
  return (
    <header className={styles.topbar} role="banner">
      {/* Mobile hamburger */}
      <button
        className={styles.menuBtn}
        onClick={onMenuToggle}
        aria-label="Open navigation menu"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          width="20" height="20">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      {/* Page title */}
      <div className={styles.titleArea}>
        <h1 className={styles.pageTitle}>{pageTitle}</h1>
      </div>

      {/* Right controls */}
      <div className={styles.controls}>
        {/* Search */}
        <div className={styles.searchWrap}>
          <svg className={styles.searchIcon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            aria-hidden="true">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            id="topbar-search"
            className={styles.searchInput}
            type="search"
            placeholder="Search rooms, residents…"
            aria-label="Search rooms and residents"
          />
        </div>

        {/* Notification bell */}
        <button className={styles.iconBtn} aria-label="Notifications (3 unread)">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"
            width="20" height="20">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          <span className={styles.notifDot} aria-hidden="true" />
        </button>

        {/* Avatar */}
        <div className={styles.avatar} role="img" aria-label="Admin user">A</div>
      </div>
    </header>
  );
}
