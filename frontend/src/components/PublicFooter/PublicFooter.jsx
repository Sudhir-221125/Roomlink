/**
 * PublicFooter.jsx
 * Professional footer for the public landing experience.
 */
import styles from './PublicFooter.module.css';

export default function PublicFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer} aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">Footer</h2>
      <div className={styles.container}>
        
        {/* Brand Column */}
        <div className={styles.brandCol}>
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
          <p className={styles.brandDesc}>
            The dynamic living space manager for modern co-living communities and property managers.
          </p>
        </div>

        {/* Links Grid */}
        <div className={styles.linksGrid}>
          <div className={styles.linkGroup}>
            <h3 className={styles.groupTitle}>Product</h3>
            <ul role="list" className={styles.linkList}>
              <li><a href="#product" className={styles.link}>Overview</a></li>
              <li><a href="#features" className={styles.link}>Features</a></li>
              <li><a href="#how-it-works" className={styles.link}>How it Works</a></li>
            </ul>
          </div>

          <div className={styles.linkGroup}>
            <h3 className={styles.groupTitle}>Platform</h3>
            <ul role="list" className={styles.linkList}>
              <li><a href="#product" className={styles.link}>Dashboard</a></li>
              <li><a href="#features" className={styles.link}>Rooms & Residents</a></li>
              <li><a href="#features" className={styles.link}>Rent Payments</a></li>
              <li><a href="#features" className={styles.link}>Shared Bills</a></li>
              <li><a href="#features" className={styles.link}>Rotating Chores</a></li>
            </ul>
          </div>

          <div className={styles.linkGroup}>
            <h3 className={styles.groupTitle}>Support</h3>
            <ul role="list" className={styles.linkList}>
              <li><a href="#" className={styles.link}>Help Center</a></li>
              <li><a href="#" className={styles.link}>Contact Us</a></li>
              <li><a href="#" className={styles.link}>FAQ</a></li>
            </ul>
          </div>

          <div className={styles.linkGroup}>
            <h3 className={styles.groupTitle}>Legal</h3>
            <ul role="list" className={styles.linkList}>
              <li><a href="#" className={styles.link}>Privacy Policy</a></li>
              <li><a href="#" className={styles.link}>Terms of Service</a></li>
            </ul>
          </div>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className={styles.bottomBar}>
        <div className={styles.bottomContainer}>
          <p className={styles.copyright}>&copy; {currentYear} RoomLink Inc. All rights reserved.</p>
          <div className={styles.socials}>
            <a href="#" aria-label="Twitter" className={styles.socialLink}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
            </a>
            <a href="#" aria-label="LinkedIn" className={styles.socialLink}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
