/**
 * Sidebar.jsx
 * RoomLink left-hand navigation sidebar.
 *
 * Changes from original:
 * - Shows a space selector dropdown below the brand logo
 * - 'Rooms & Residents' nav item renamed to 'Members' (page id: members)
 * - Bottom user section shows real user name + role_in_space from contexts
 * - Supports collapsed state on smaller screens and mobile overlay mode
 */
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useSpace } from '../../contexts/SpaceContext';
import { useToast } from '../../contexts/ToastContext';
import CreateSpaceModal from '../CreateSpaceModal/CreateSpaceModal';
import styles from './Sidebar.module.css';

// ── Nav item definitions ─────────────────────────────────────────────────────
const NAV_ITEMS = [
  {
    id: 'overview',
    label: 'Overview',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    id: 'members',
    label: 'Members',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    id: 'rent',
    label: 'Payments',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <line x1="2" y1="10" x2="22" y2="10" />
      </svg>
    ),
  },
  {
    id: 'bills',
    label: 'Bills',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="9" y1="13" x2="15" y2="13" />
        <line x1="9" y1="17" x2="13" y2="17" />
      </svg>
    ),
  },
  {
    id: 'chores',
    label: 'Chores',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 11 12 14 22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </svg>
    ),
  },
  {
    id: 'complaints',
    label: 'Complaints',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
  },
  {
    id: 'guests',
    label: 'Guests',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <line x1="23" y1="11" x2="17" y2="11" />
        <line x1="20" y1="8" x2="20" y2="14" />
      </svg>
    ),
  },
  {
    id: 'notifications',
    label: 'Notifications',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
    ),
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
  },
];

// ── Space Selector ───────────────────────────────────────────────────────────
function SpaceSelector({ collapsed }) {
  const { spaces, currentSpace, selectSpace, isLoadingSpaces } = useSpace();
  const { showToast } = useToast();
  const [open, setOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  if (isLoadingSpaces) {
    return (
      <div className={styles.spaceSelector} title="Loading spaces…">
        <div className={styles.spaceSelectorIcon}>⊙</div>
        {!collapsed && <span className={styles.spaceSelectorLabel}>Loading…</span>}
      </div>
    );
  }

  const spaceInitial = currentSpace?.name?.charAt(0).toUpperCase() || '＋';
  const displayTitle = currentSpace?.name || 'No space selected';
  const displayLabel = currentSpace?.name || 'No space';

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        className={styles.spaceSelector}
        onClick={() => setOpen(v => !v)}
        title={displayTitle}
        aria-label={`Current space: ${displayTitle}. Click to switch.`}
        aria-expanded={open}
      >
        <div className={styles.spaceSelectorIcon}>{spaceInitial}</div>
        {!collapsed && (
          <>
            <div style={{ flex: 1, textAlign: 'left', overflow: 'hidden' }}>
              <div className={styles.spaceSelectorLabel} style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {displayLabel}
              </div>
              {currentSpace?.type && (
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', lineHeight: 1 }}>{currentSpace.type}</div>
              )}
            </div>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14" style={{ flexShrink: 0, opacity: 0.5 }}>
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </>
        )}
      </button>

      {open && !collapsed && (
        <div className={styles.spaceDropdown} role="listbox" aria-label="Switch space">
          {spaces.map(space => {
            const id = space._id || space.id;
            const isSelected = id === (currentSpace?._id || currentSpace?.id);
            return (
              <button
                key={id}
                className={`${styles.spaceOption} ${isSelected ? styles.spaceOptionActive : ''}`}
                onClick={() => { selectSpace(id); setOpen(false); }}
                role="option"
                aria-selected={isSelected}
              >
                <div className={styles.spaceOptionIcon}>{space.name?.charAt(0).toUpperCase()}</div>
                <div>
                  <div style={{ fontWeight: 500, fontSize: 'var(--text-sm)' }}>{space.name}</div>
                  {space.type && <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{space.type}</div>}
                </div>
                {isSelected && (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="14" height="14" style={{ marginLeft: 'auto', color: 'var(--color-primary)' }}>
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </button>
            );
          })}
          
          <button
            className={styles.spaceOption}
            onClick={() => { setCreateModalOpen(true); setOpen(false); }}
            style={{ 
              color: 'var(--color-primary)', 
              borderTop: spaces.length > 0 ? '1px solid var(--color-border)' : 'none', 
              marginTop: spaces.length > 0 ? 'var(--space-1)' : 0 
            }}
          >
            <div className={styles.spaceOptionIcon} style={{ background: 'transparent' }}>＋</div>
            <div style={{ fontWeight: 500, fontSize: 'var(--text-sm)' }}>Create Space</div>
          </button>
        </div>
      )}
      
      {createModalOpen && (
        <CreateSpaceModal onClose={() => setCreateModalOpen(false)} showToast={showToast} />
      )}
    </div>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function Sidebar({ activePage, onNavigate, collapsed, mobileOpen, onMobileClose }) {
  const { user } = useAuth();
  const { myRole } = useSpace();

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && mobileOpen) {
        onMobileClose();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileOpen, onMobileClose]);

  const userInitial = user?.name?.charAt(0).toUpperCase() || '?';
  const userName = user?.name || 'User';
  const userRoleLabel = myRole ? myRole.charAt(0).toUpperCase() + myRole.slice(1) : 'Member';

  return (
    <>
      {/* Mobile backdrop overlay */}
      {mobileOpen && (
        <div
          className={styles.backdrop}
          onClick={onMobileClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={[
          styles.sidebar,
          collapsed ? styles.collapsed : '',
          mobileOpen ? styles.mobileOpen : '',
        ].join(' ')}
        aria-label="Main navigation"
      >
        {/* ── Brand / Logo ── */}
        <div className={styles.brand}>
          <div className={styles.brandIcon} aria-hidden="true">
            <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="32" height="32" rx="8" fill="var(--color-primary)" />
              <path d="M7 22V13l9-7 9 7v9" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <rect x="13" y="16" width="6" height="6" rx="1" fill="#fff" fillOpacity="0.85" />
            </svg>
          </div>
          {!collapsed && (
            <div className={styles.brandText}>
              <span className={styles.brandName}>RoomLink</span>
              <span className={styles.brandTagline}>Living Space Manager</span>
            </div>
          )}
        </div>

        {/* ── Space Selector ── */}
        <div style={{ padding: collapsed ? 'var(--space-2)' : 'var(--space-2) var(--space-3)', borderBottom: '1px solid var(--color-border)' }}>
          <SpaceSelector collapsed={collapsed} />
        </div>

        {/* ── Nav section label ── */}
        {!collapsed && (
          <p className={styles.sectionLabel}>MAIN MENU</p>
        )}

        {/* ── Nav items ── */}
        <nav className={styles.nav}>
          <ul className={styles.navList} role="list">
            {NAV_ITEMS.map((item) => (
              <li key={item.id}>
                <button
                  className={[
                    styles.navItem,
                    activePage === item.id ? styles.navItemActive : '',
                  ].join(' ')}
                  onClick={() => {
                    onNavigate(item.id);
                    if (mobileOpen) onMobileClose();
                  }}
                  aria-current={activePage === item.id ? 'page' : undefined}
                  title={collapsed ? item.label : undefined}
                  aria-label={item.label}
                >
                  <span className={styles.navIcon} aria-hidden="true">
                    {item.icon}
                  </span>
                  {!collapsed && (
                    <span className={styles.navLabel}>{item.label}</span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* ── User profile at bottom ── */}
        <div className={styles.userSection}>
          <div className={styles.userAvatar} aria-hidden="true">{userInitial}</div>
          {!collapsed && (
            <div className={styles.userInfo}>
              <p className={styles.userName}>{userName}</p>
              <p className={styles.userRole}>{userRoleLabel}</p>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
