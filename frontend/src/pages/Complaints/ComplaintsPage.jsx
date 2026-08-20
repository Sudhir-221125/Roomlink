import { useState } from 'react';
import styles from './ComplaintsPage.module.css';
import Tabs from '../../components/common/Tabs';
import Badge from '../../components/common/Badge';
import { useToast } from '../../contexts/ToastContext';

const MOCK_COMPLAINTS = [
  { id: 'iss-001', title: 'Leaking faucet in bathroom', resident: 'Alice S.', room: '101', priority: 'High', status: 'Open', created: '2023-10-18', assignedTo: 'Maintenance Team' },
  { id: 'iss-002', title: 'Noise complaint from 202', resident: 'Bob J.', room: '201', priority: 'Medium', status: 'In Progress', created: '2023-10-19', assignedTo: 'Property Manager' },
  { id: 'iss-003', title: 'Broken window blind', resident: 'Charlie D.', room: '202', priority: 'Low', status: 'Open', created: '2023-10-20', assignedTo: 'Unassigned' },
  { id: 'iss-004', title: 'Heater not working', resident: 'Diana E.', room: '103', priority: 'High', status: 'Resolved', created: '2023-10-15', assignedTo: 'Maintenance Team', resolved: '2023-10-16' },
];

const TABS = [
  { id: 'open', label: 'Open Issues' },
  { id: 'in_progress', label: 'In Progress' },
  { id: 'resolved', label: 'Resolved' },
];

export default function ComplaintsPage() {
  const [activeTab, setActiveTab] = useState('open');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const { showToast } = useToast();

  const filteredIssues = MOCK_COMPLAINTS.filter(issue => {
    if (activeTab === 'open' && issue.status !== 'Open') return false;
    if (activeTab === 'in_progress' && issue.status !== 'In Progress') return false;
    if (activeTab === 'resolved' && issue.status !== 'Resolved') return false;

    if (priorityFilter !== 'All' && issue.priority !== priorityFilter) return false;

    return true;
  });

  const getPriorityVariant = (priority) => {
    switch (priority) {
      case 'High': return 'danger';
      case 'Medium': return 'warning';
      case 'Low': return 'info';
      default: return 'neutral';
    }
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'Resolved': return 'success';
      case 'In Progress': return 'warning';
      case 'Open': return 'danger';
      default: return 'neutral';
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Issues & Complaints</h1>
          <p className={styles.subtitle}>Track maintenance requests and resident concerns.</p>
        </div>
        <button 
          className={styles.primaryButton}
          onClick={() => showToast('Report issue form coming soon', 'info')}
        >+ Report Issue</button>
      </header>

      <Tabs tabs={TABS} activeTab={activeTab} onChange={(tab) => {
        setActiveTab(tab);
        setPriorityFilter('All');
      }} />

      <div className={styles.controls}>
        <select 
          value={priorityFilter} 
          onChange={(e) => setPriorityFilter(e.target.value)}
          className={styles.filterSelect}
        >
          <option value="All">All Priorities</option>
          <option value="High">High Priority</option>
          <option value="Medium">Medium Priority</option>
          <option value="Low">Low Priority</option>
        </select>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Issue ID</th>
              <th>Title</th>
              <th>Reporter</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Created</th>
              <th>Assigned To</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredIssues.length > 0 ? (
              filteredIssues.map(issue => (
                <tr key={issue.id}>
                  <td className={styles.issueId}>{issue.id}</td>
                  <td className={styles.issueTitle}>{issue.title}</td>
                  <td>
                    <div className={styles.reporter}>
                      <span className={styles.name}>{issue.resident}</span>
                      <span className={styles.room}>Room {issue.room}</span>
                    </div>
                  </td>
                  <td><Badge variant={getPriorityVariant(issue.priority)}>{issue.priority}</Badge></td>
                  <td><Badge variant={getStatusVariant(issue.status)}>{issue.status}</Badge></td>
                  <td className={styles.dateCell}>{issue.created}</td>
                  <td className={styles.assignee}>{issue.assignedTo}</td>
                  <td>
                    <button 
                      className={styles.textButton}
                      onClick={() => showToast('Issue detail view coming soon', 'info')}
                    >View</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className={styles.emptyRow}>
                  No {activeTab.replace('_', ' ')} issues found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
