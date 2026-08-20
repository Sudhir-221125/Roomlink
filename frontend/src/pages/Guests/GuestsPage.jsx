/**
 * GuestsPage.jsx
 *
 * ⚠️  FUTURE FEATURE — Guest management is not yet implemented in the backend.
 *
 * There is NO Guest model in the database. No /api/guests endpoint exists.
 * This page is preserved as a planned feature preview with local mock data only.
 * Do NOT treat the data shown here as persisted or real.
 *
 * When the backend implements Guest support, replace MOCK_GUESTS with
 * a guestService.js API call and remove the notice banner.
 */
import { useState } from 'react';
import styles from './GuestsPage.module.css';
import Tabs from '../../components/common/Tabs';
import Badge from '../../components/common/Badge';
import EmptyState from '../../components/common/EmptyState';

// 🟡 MOCK DATA — No Guest model in the database.
// This data is local only and not persisted anywhere.
const MOCK_GUESTS = [
  { id: 'g1', name: 'John Doe',      host: 'Member A', arrival: '2024-10-25 14:00', departure: '2024-10-27 10:00', status: 'Upcoming' },
  { id: 'g2', name: 'Jane Smith',    host: 'Member B', arrival: '2024-10-23 18:00', departure: '2024-10-26 12:00', status: 'Active' },
  { id: 'g3', name: 'Mike Johnson',  host: 'Member C', arrival: '2024-10-20 15:00', departure: '2024-10-22 11:00', status: 'Past' },
  { id: 'g4', name: 'Sarah Wilson',  host: 'Member A', arrival: '2024-11-01 10:00', departure: '2024-11-05 10:00', status: 'Upcoming' },
];

const TABS = [
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'active',   label: 'Current Guests' },
  { id: 'history',  label: 'History' },
];

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={styles.icon}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
  </svg>
);

export default function GuestsPage() {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredGuests = MOCK_GUESTS.filter(guest => {
    let matchTab = false;
    if (activeTab === 'upcoming' && guest.status === 'Upcoming') matchTab = true;
    if (activeTab === 'active'   && guest.status === 'Active')   matchTab = true;
    if (activeTab === 'history'  && guest.status === 'Past')     matchTab = true;
    const matchSearch = guest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        guest.host.toLowerCase().includes(searchQuery.toLowerCase());
    return matchTab && matchSearch;
  });

  const getStatusVariant = (status) => {
    switch (status) {
      case 'Active':   return 'success';
      case 'Upcoming': return 'info';
      case 'Past':     return 'neutral';
      default:         return 'neutral';
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Guest Management</h1>
          <p className={styles.subtitle}>Register and manage visitors.</p>
        </div>
        <button
          className={styles.primaryButton}
          disabled
          title="Guest registration requires backend support — coming soon"
        >
          + Register Guest
        </button>
      </header>

      {/* ── Future Feature Banner ── */}
      <div style={{
        background: 'color-mix(in srgb, var(--color-warning, #f59e0b) 10%, transparent)',
        border: '1px solid color-mix(in srgb, var(--color-warning, #f59e0b) 40%, transparent)',
        borderRadius: 'var(--radius-md)',
        padding: 'var(--space-3) var(--space-4)',
        marginBottom: 'var(--space-4)',
        display: 'flex',
        alignItems: 'flex-start',
        gap: 'var(--space-3)',
        fontSize: 'var(--text-sm)',
      }}>
        <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>🚧</span>
        <div>
          <strong style={{ color: 'var(--color-text)' }}>Planned Feature — Preview Only</strong>
          <p style={{ margin: '0.25rem 0 0', color: 'var(--color-text-muted)' }}>
            Guest management is not yet implemented in the backend. There is no Guest model in the database.
            The data shown below is local mock data and is <em>not</em> persisted. This page will be connected
            to a real API once the Guest feature is built.
          </p>
        </div>
      </div>

      <Tabs tabs={TABS} activeTab={activeTab} onChange={(tab) => {
        setActiveTab(tab);
        setSearchQuery('');
      }} />

      <div className={styles.controls}>
        <div className={styles.searchBox}>
          <SearchIcon />
          <input
            type="text"
            placeholder="Search guests or hosts…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      </div>

      <div className={styles.content}>
        {filteredGuests.length > 0 ? (
          <div className={styles.grid}>
            {filteredGuests.map(guest => (
              <div key={guest.id} className={styles.card}>
                <div className={styles.cardHeader}>
                  <h3 className={styles.cardTitle}>{guest.name}</h3>
                  <Badge variant={getStatusVariant(guest.status)}>{guest.status}</Badge>
                </div>
                <div className={styles.cardBody}>
                  <p className={styles.detail}><strong>Host:</strong> {guest.host}</p>
                  <p className={styles.detail}><strong>Arrival:</strong> {guest.arrival}</p>
                  <p className={styles.detail}><strong>Departure:</strong> {guest.departure}</p>
                </div>
                <div className={styles.cardFooter}>
                  <button
                    className={styles.textButton}
                    disabled
                    title="Preview only — not connected to backend"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<SearchIcon />}
            title="No guests found"
            description="We couldn't find any guests matching your current view."
          />
        )}
      </div>
    </div>
  );
}
