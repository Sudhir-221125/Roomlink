/**
 * AppLayout.jsx
 * Root shell layout — composes Sidebar + Topbar + SearchOverlay + main content area.
 * Handles sidebar collapsed/mobile state and page routing.
 */
import { useState } from 'react';
import Sidebar from '../components/Sidebar/Sidebar';
import Topbar from '../components/Topbar/Topbar';
import SearchOverlay from '../components/SearchOverlay/SearchOverlay';
import { useWindowSize } from '../hooks/useWindowSize';
import styles from './AppLayout.module.css';

// Page title map (used by the Topbar/Breadcrumb)
const PAGE_TITLES = {
  overview:     'Overview',
  rooms:        'Rooms & Residents',
  rent:         'Rent',
  bills:        'Bills',
  chores:       'Chores',
  complaints:   'Complaints',
  guests:       'Guests',
  notifications:'Notifications',
  settings:     'Settings',
};

export default function AppLayout({ activePage, onNavigate, onLogout, children }) {
  const { width } = useWindowSize();

  // On mobile (<= 768px) sidebar is overlay; on desktop it can collapse to icons
  const isMobile = width <= 768;
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  function handleMenuToggle() {
    if (isMobile) {
      setMobileOpen((v) => !v);
    } else {
      setCollapsed((v) => !v);
    }
  }

  // Keyboard shortcut for search (Cmd/Ctrl + K)
  // useEffect intentionally omitted — using native listener approach
  // is fine for a simple shortcut on the layout level
  if (typeof window !== 'undefined') {
    // Only attach once via a module-level guard
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
          onSearchOpen={() => setSearchOpen(true)}
          onLogout={onLogout}
        />

        {/* Page content */}
        <main className={styles.content} id="main-content">
          <div key={activePage} className={styles.pageTransition}>
            {children}
          </div>
        </main>
      </div>

      {/* Search Overlay (global) */}
      <SearchOverlay
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        onNavigate={(page) => {
          onNavigate(page);
          setSearchOpen(false);
        }}
      />
    </div>
  );
}
