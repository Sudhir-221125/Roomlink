import { useState } from 'react';
import styles from './RoomsPage.module.css';
import Tabs from '../../components/common/Tabs';
import Badge from '../../components/common/Badge';
import EmptyState from '../../components/common/EmptyState';
import { useToast } from '../../contexts/ToastContext';

// --- Mock Data ---
const MOCK_ROOMS = [
  { id: '101', number: '101', type: 'Single', status: 'Occupied', residentId: 'r1', rent: 800 },
  { id: '102', number: '102', type: 'Double', status: 'Vacant', residentId: null, rent: 1200 },
  { id: '103', number: '103', type: 'Single', status: 'Maintenance', residentId: null, rent: 850 },
  { id: '201', number: '201', type: 'Suite', status: 'Occupied', residentId: 'r2', rent: 1500 },
  { id: '202', number: '202', type: 'Single', status: 'Occupied', residentId: 'r3', rent: 820 },
];

const MOCK_RESIDENTS = [
  { id: 'r1', name: 'Alice Smith', email: 'alice@example.com', phone: '555-0101', roomId: '101', status: 'Active', moveIn: '2023-01-15' },
  { id: 'r2', name: 'Bob Johnson', email: 'bob@example.com', phone: '555-0202', roomId: '201', status: 'Active', moveIn: '2022-11-01' },
  { id: 'r3', name: 'Charlie Davis', email: 'charlie@example.com', phone: '555-0303', roomId: '202', status: 'Pending', moveIn: '2023-09-01' },
];

const TABS = [
  { id: 'rooms', label: 'Rooms' },
  { id: 'residents', label: 'Residents' }
];

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={styles.icon}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
  </svg>
);

export default function RoomsPage() {
  const [activeTab, setActiveTab] = useState('rooms');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const { showToast } = useToast();

  // Derived state
  const filteredRooms = MOCK_ROOMS.filter(room => {
    const matchesSearch = room.number.includes(searchQuery) || room.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || room.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredResidents = MOCK_RESIDENTS.filter(res => {
    const matchesSearch = res.name.toLowerCase().includes(searchQuery.toLowerCase()) || res.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || res.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusVariant = (status) => {
    switch (status) {
      case 'Occupied':
      case 'Active': return 'success';
      case 'Vacant': return 'neutral';
      case 'Maintenance': return 'warning';
      case 'Pending': return 'info';
      default: return 'neutral';
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Rooms & Residents</h1>
          <p className={styles.subtitle}>Manage your property's spaces and the people who live in them.</p>
        </div>
        <div className={styles.actions}>
          <button 
            className={styles.primaryButton}
            onClick={() => showToast(`Add ${activeTab === 'rooms' ? 'Room' : 'Resident'} modal coming soon`, 'info')}
          >
            {activeTab === 'rooms' ? '+ Add Room' : '+ Add Resident'}
          </button>
        </div>
      </header>

      <Tabs tabs={TABS} activeTab={activeTab} onChange={(tab) => {
        setActiveTab(tab);
        setSearchQuery('');
        setStatusFilter('All');
      }} />

      <div className={styles.controls}>
        <div className={styles.searchBox}>
          <SearchIcon />
          <input 
            type="text" 
            placeholder={`Search ${activeTab}...`} 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        
        <select 
          value={statusFilter} 
          onChange={(e) => setStatusFilter(e.target.value)}
          className={styles.filterSelect}
        >
          <option value="All">All Statuses</option>
          {activeTab === 'rooms' ? (
            <>
              <option value="Occupied">Occupied</option>
              <option value="Vacant">Vacant</option>
              <option value="Maintenance">Maintenance</option>
            </>
          ) : (
            <>
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
            </>
          )}
        </select>
      </div>

      <div className={styles.content}>
        {activeTab === 'rooms' && (
          filteredRooms.length > 0 ? (
            <div className={styles.grid}>
              {filteredRooms.map(room => (
                <div key={room.id} className={styles.card}>
                  <div className={styles.cardHeader}>
                    <h3 className={styles.cardTitle}>Room {room.number}</h3>
                    <Badge variant={getStatusVariant(room.status)}>{room.status}</Badge>
                  </div>
                  <div className={styles.cardBody}>
                    <p className={styles.detail}><strong>Type:</strong> {room.type}</p>
                    <p className={styles.detail}><strong>Rent:</strong> ${room.rent}/mo</p>
                    {room.residentId ? (
                      <p className={styles.detail}><strong>Resident:</strong> {MOCK_RESIDENTS.find(r => r.id === room.residentId)?.name}</p>
                    ) : (
                      <p className={styles.detail}><em>No resident assigned</em></p>
                    )}
                  </div>
                  <div className={styles.cardFooter}>
                    <button 
                      className={styles.textButton}
                      onClick={() => showToast('View room details coming soon', 'info')}
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
              title="No rooms found" 
              description="We couldn't find any rooms matching your current filters." 
            />
          )
        )}

        {activeTab === 'residents' && (
          filteredResidents.length > 0 ? (
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Room</th>
                    <th>Contact</th>
                    <th>Move In</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredResidents.map(res => (
                    <tr key={res.id}>
                      <td>
                        <div className={styles.residentInfo}>
                          <div className={styles.avatar}>{res.name.charAt(0)}</div>
                          <div>
                            <div className={styles.resName}>{res.name}</div>
                            <div className={styles.resEmail}>{res.email}</div>
                          </div>
                        </div>
                      </td>
                      <td>Room {res.roomId}</td>
                      <td>{res.phone}</td>
                      <td>{res.moveIn}</td>
                      <td><Badge variant={getStatusVariant(res.status)}>{res.status}</Badge></td>
                      <td>
                        <button 
                          className={styles.textButton}
                          onClick={() => showToast('View resident details coming soon', 'info')}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState 
              icon={<SearchIcon />} 
              title="No residents found" 
              description="We couldn't find any residents matching your current filters." 
            />
          )
        )}
      </div>
    </div>
  );
}
