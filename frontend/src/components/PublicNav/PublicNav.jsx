/**
 * PublicNav.jsx
 * Top navigation for the unauthenticated landing page.
 */
import { useState } from 'react';
import styles from './PublicNav.module.css';

export default function PublicNav({ onLogin }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className={styles.nav} aria-label="Main navigation">
      <div className={styles.container}>
        {/* Brand */}
        <div className={styles.brand}>
          <div className={styles.brandIcon} aria-hidden="true">
            <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="32" height="32" rx="8" fill="var(--color-primary)" />
              <path d="M7 22V13l9-7 9 7v9" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <rect x="13" y="16" width="6" height="6" rx="1" fill="#fff" fillOpacity="0.85" />
            </svg>
          </div>
          <span className={styles.brandName}>RoomLink</span>
        </div>

        {/* Desktop Links */}
        <ul className={styles.desktopLinks}>
          <li><a href="#product" className={styles.link}>Product</a></li>
          <li><a href="#features" className={styles.link}>Features</a></li>
          <li><a href="#how-it-works" className={styles.link}>How it Works</a></li>
          <li><a href="#benefits" className={styles.link}>Benefits & About</a></li>
        </ul>

        {/* Desktop CTAs */}
        <div className={styles.desktopCtas}>
          <button className="rl-btn rl-btn-outline" onClick={onLogin}>
            Sign In
          </button>
          <button className="rl-btn rl-btn-primary" onClick={onLogin}>
            Get Started
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className={styles.mobileToggle} 
          onClick={() => setMobileMenuOpen(prev => !prev)}
          aria-expanded={mobileMenuOpen}
          aria-label="Toggle mobile menu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" 
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
            width="24" height="24">
            {mobileMenuOpen ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </>
            ) : (
              <>
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className={styles.mobileMenu}>
          <ul className={styles.mobileLinks}>
            <li><a href="#product" className={styles.mobileLink} onClick={() => setMobileMenuOpen(false)}>Product</a></li>
            <li><a href="#features" className={styles.mobileLink} onClick={() => setMobileMenuOpen(false)}>Features</a></li>
            <li><a href="#how-it-works" className={styles.mobileLink} onClick={() => setMobileMenuOpen(false)}>How it Works</a></li>
            <li><a href="#benefits" className={styles.mobileLink} onClick={() => setMobileMenuOpen(false)}>Benefits & About</a></li>
          </ul>
          <div className={styles.mobileCtas}>
            <button className="rl-btn rl-btn-outline" onClick={() => { setMobileMenuOpen(false); onLogin(); }}>Sign In</button>
            <button className="rl-btn rl-btn-primary" onClick={() => { setMobileMenuOpen(false); onLogin(); }}>Get Started</button>
          </div>
        </div>
      )}
    </nav>
  );
}
