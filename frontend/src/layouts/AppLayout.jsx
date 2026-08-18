/**
 * AppLayout.jsx
 * Root shell layout — composes Sidebar + Topbar + main content area.
 * Handles sidebar collapsed/mobile state and page routing.
 */
import { useState } from 'react';
import Sidebar from '../components/Sidebar/Sidebar';
import Topbar from '../components/Topbar/Topbar';
import { useWindowSize } from '../hooks/useWindowSize';
import styles from './AppLayout.module.css';

// Page title map (used by the Topbar)
const PAGE_TITLES = {
  dashboard:  'Dashboard',
  rooms:      'Rooms & Residents',
  rent:       'Rent & Payments',
  bills:      'Bills',
  chores:     'Chores',
  complaints: 'Complaints',
  guests:     'Guests',
  settings:   'Settings',
};

export default function AppLayout({ activePage, onNavigate, children }) {
  const { width } = useWindowSize();

  // On mobile (<= 768px) sidebar is overlay; on desktop it can collapse to icons
  const isMobile = width <= 768;
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  function handleMenuToggle() {
    if (isMobile) {
      setMobileOpen((v) => !v);
    } else {
      setCollapsed((v) => !v);
    }
  }

  return (
    <div className={styles.shell}>
      {/* Sidebar */}
      <Sidebar
        activePage={activePage}
        onNavigate={onNavigate}
        collapsed={!isMobile && collapsed}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      {/* Main wrapper (shifts right by sidebar width) */}
      <div
        className={[
          styles.main,
          (!isMobile && collapsed) ? styles.mainCollapsed : '',
        ].join(' ')}
      >
        {/* Topbar */}
        <Topbar
          pageTitle={PAGE_TITLES[activePage] || 'RoomLink'}
          onMenuToggle={handleMenuToggle}
        />

        {/* Page content */}
        <main className={styles.content} id="main-content">
          {children}
        </main>
      </div>
    </div>
  );
}
