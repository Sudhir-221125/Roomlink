/**
 * Topbar.jsx
 * Top navigation bar — shows page title, search trigger, notifications, and user controls.
 */
import { useState } from 'react';
import NotificationDropdown from '../NotificationDropdown/NotificationDropdown';
import styles from './Topbar.module.css';

export default function Topbar({ pageTitle, onMenuToggle, onSearchOpen, onLogout }) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

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

      {/* Breadcrumb / Page title */}
      <nav aria-label="Breadcrumb" className={styles.breadcrumbArea}>
        <span className={styles.breadcrumbBrand}>App</span>
        <span className={styles.breadcrumbSep}>/</span>
        <h1 className={styles.pageTitle}>{pageTitle}</h1>
      </nav>

      {/* Right controls */}
      <div className={styles.controls}>
        {/* Search trigger */}
        <button
          className={styles.searchBtn}
          onClick={onSearchOpen}
          aria-label="Search rooms and residents"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            width="16" height="16" aria-hidden="true">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <span className={styles.searchLabel}>Search…</span>
          <kbd className={styles.searchKbd}>⌘K</kbd>
        </button>

        {/* Notification bell */}
        <div className={styles.notifWrap}>
          <button
            className={styles.iconBtn}
            onClick={() => { setNotifOpen((v) => !v); setProfileOpen(false); }}
            aria-label="Notifications (2 unread)"
            aria-expanded={notifOpen}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"
              width="19" height="19">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            <span className={styles.notifDot} aria-hidden="true" />
          </button>
          <NotificationDropdown open={notifOpen} onClose={() => setNotifOpen(false)} />
        </div>

        {/* Avatar Profile Dropdown */}
        <div className={styles.profileWrap}>
          <button 
            className={styles.avatarBtn} 
            onClick={() => { setProfileOpen((v) => !v); setNotifOpen(false); }}
            aria-label="Toggle profile menu"
            aria-expanded={profileOpen}
          >
            <div className={styles.avatar} role="img" aria-hidden="true">A</div>
          </button>
          
          {profileOpen && (
            <>
              <div className={styles.dropdownBackdrop} onClick={() => setProfileOpen(false)} />
              <div className={styles.profileDropdown}>
                <div className={styles.profileHeader}>
                  <p className={styles.profileName}>Admin User</p>
                  <p className={styles.profileEmail}>admin@roomlink.com</p>
                </div>
                <div className={styles.profileActions}>
                  <button className={styles.dropdownItem}>Account Settings</button>
                  <button className={styles.dropdownItem} onClick={onLogout}>Log Out</button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
