import { useState } from 'react';
import styles from './GuestsPage.module.css';
import Tabs from '../../components/common/Tabs';
import Badge from '../../components/common/Badge';
import EmptyState from '../../components/common/EmptyState';
import { useToast } from '../../contexts/ToastContext';

const MOCK_GUESTS = [
  { id: 'g1', name: 'John Doe', host: 'Alice S.', room: '101', arrival: '2023-10-25 14:00', departure: '2023-10-27 10:00', status: 'Upcoming' },
  { id: 'g2', name: 'Jane Smith', host: 'Bob J.', room: '201', arrival: '2023-10-23 18:00', departure: '2023-10-26 12:00', status: 'Active' },
  { id: 'g3', name: 'Mike Johnson', host: 'Charlie D.', room: '202', arrival: '2023-10-20 15:00', departure: '2023-10-22 11:00', status: 'Past' },
  { id: 'g4', name: 'Sarah Wilson', host: 'Alice S.', room: '101', arrival: '2023-11-01 10:00', departure: '2023-11-05 10:00', status: 'Upcoming' },
];

const TABS = [
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'active', label: 'Current Guests' },
  { id: 'history', label: 'History' },
];

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={styles.icon}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
  </svg>
);

export default function GuestsPage() {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [searchQuery, setSearchQuery] = useState('');
  const { showToast } = useToast();

  const filteredGuests = MOCK_GUESTS.filter(guest => {
    let matchTab = false;
    if (activeTab === 'upcoming' && guest.status === 'Upcoming') matchTab = true;
    if (activeTab === 'active' && guest.status === 'Active') matchTab = true;
    if (activeTab === 'history' && guest.status === 'Past') matchTab = true;

    const matchSearch = guest.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        guest.host.toLowerCase().includes(searchQuery.toLowerCase());

    return matchTab && matchSearch;
  });

  const getStatusVariant = (status) => {
    switch (status) {
      case 'Active': return 'success';
      case 'Upcoming': return 'info';
      case 'Past': return 'neutral';
      default: return 'neutral';
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
          onClick={() => showToast('Guest registration form coming soon', 'info')}
        >+ Register Guest</button>
      </header>

      <Tabs tabs={TABS} activeTab={activeTab} onChange={(tab) => {
        setActiveTab(tab);
        setSearchQuery('');
      }} />

      <div className={styles.controls}>
        <div className={styles.searchBox}>
          <SearchIcon />
          <input 
            type="text" 
            placeholder="Search guests or hosts..." 
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
                  <p className={styles.detail}><strong>Host:</strong> {guest.host} (Room {guest.room})</p>
                  <p className={styles.detail}><strong>Arrival:</strong> {guest.arrival}</p>
                  <p className={styles.detail}><strong>Departure:</strong> {guest.departure}</p>
                </div>
                <div className={styles.cardFooter}>
                  <button 
                    className={styles.textButton}
                    onClick={() => showToast('Guest details view coming soon', 'info')}
                  >View Details</button>
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
