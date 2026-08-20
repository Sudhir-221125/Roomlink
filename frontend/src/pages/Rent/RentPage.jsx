import { useState } from 'react';
import styles from './RentPage.module.css';
import Tabs from '../../components/common/Tabs';
import Badge from '../../components/common/Badge';
import { useToast } from '../../contexts/ToastContext';

// --- Mock Data ---
const RENT_METRICS = {
  expected: 4800,
  collected: 3200,
  pending: 800,
  overdue: 800,
};

const MOCK_PAYMENTS = [
  { id: 'p1', resident: 'Alice Smith', room: '101', amount: 800, dueDate: '2023-10-01', status: 'Paid', paidDate: '2023-09-28' },
  { id: 'p2', resident: 'Bob Johnson', room: '201', amount: 1500, dueDate: '2023-10-01', status: 'Paid', paidDate: '2023-10-01' },
  { id: 'p3', resident: 'Charlie Davis', room: '202', amount: 820, dueDate: '2023-10-01', status: 'Overdue', paidDate: null },
  { id: 'p4', resident: 'Diana Evans', room: '103', amount: 800, dueDate: '2023-10-01', status: 'Pending', paidDate: null },
  { id: 'p5', resident: 'Alice Smith', room: '101', amount: 800, dueDate: '2023-09-01', status: 'Paid', paidDate: '2023-08-30' },
  { id: 'p6', resident: 'Bob Johnson', room: '201', amount: 1500, dueDate: '2023-09-01', status: 'Paid', paidDate: '2023-09-02' },
];

const TABS = [
  { id: 'current', label: 'Current Month' },
  { id: 'history', label: 'Payment History' }
];

export default function RentPage() {
  const [activeTab, setActiveTab] = useState('current');
  const [statusFilter, setStatusFilter] = useState('All');
  const { showToast } = useToast();

  const filteredPayments = MOCK_PAYMENTS.filter(payment => {
    const isCurrentMonth = payment.dueDate === '2023-10-01';
    
    if (activeTab === 'current' && !isCurrentMonth) return false;
    if (activeTab === 'history' && isCurrentMonth) return false;

    if (statusFilter !== 'All' && payment.status !== statusFilter) return false;

    return true;
  });

  const getStatusVariant = (status) => {
    switch (status) {
      case 'Paid': return 'success';
      case 'Pending': return 'warning';
      case 'Overdue': return 'danger';
      default: return 'neutral';
    }
  };

  const progressPercentage = (RENT_METRICS.collected / RENT_METRICS.expected) * 100;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Rent Management</h1>
          <p className={styles.subtitle}>Track rent collection and payment history.</p>
        </div>
        <button 
          className={styles.primaryButton}
          onClick={() => showToast('Record payment feature coming soon', 'info')}
        >
          Record Payment
        </button>
      </header>

      <div className={styles.metricsGrid}>
        <div className={styles.metricCard}>
          <div className={styles.metricLabel}>Total Expected</div>
          <div className={styles.metricValue}>${RENT_METRICS.expected}</div>
        </div>
        <div className={styles.metricCard}>
          <div className={styles.metricLabel}>Collected</div>
          <div className={`${styles.metricValue} ${styles.successText}`}>${RENT_METRICS.collected}</div>
        </div>
        <div className={styles.metricCard}>
          <div className={styles.metricLabel}>Pending</div>
          <div className={`${styles.metricValue} ${styles.warningText}`}>${RENT_METRICS.pending}</div>
        </div>
        <div className={styles.metricCard}>
          <div className={styles.metricLabel}>Overdue</div>
          <div className={`${styles.metricValue} ${styles.dangerText}`}>${RENT_METRICS.overdue}</div>
        </div>
      </div>

      <div className={styles.progressContainer}>
        <div className={styles.progressHeader}>
          <span>Collection Progress</span>
          <span>{Math.round(progressPercentage)}%</span>
        </div>
        <div className={styles.progressBarBg}>
          <div className={styles.progressBarFill} style={{ width: `${progressPercentage}%` }} />
        </div>
      </div>

      <Tabs tabs={TABS} activeTab={activeTab} onChange={(tab) => {
        setActiveTab(tab);
        setStatusFilter('All');
      }} />

      <div className={styles.controls}>
        <select 
          value={statusFilter} 
          onChange={(e) => setStatusFilter(e.target.value)}
          className={styles.filterSelect}
        >
          <option value="All">All Statuses</option>
          <option value="Paid">Paid</option>
          <option value="Pending">Pending</option>
          <option value="Overdue">Overdue</option>
        </select>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Resident</th>
              <th>Room</th>
              <th>Amount</th>
              <th>Due Date</th>
              <th>Status</th>
              <th>Paid On</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.map(payment => (
              <tr key={payment.id}>
                <td className={styles.residentName}>{payment.resident}</td>
                <td>Room {payment.room}</td>
                <td className={styles.amount}>${payment.amount}</td>
                <td>{payment.dueDate}</td>
                <td><Badge variant={getStatusVariant(payment.status)}>{payment.status}</Badge></td>
                <td className={styles.dateCell}>{payment.paidDate || '-'}</td>
                <td>
                  <button 
                    className={styles.textButton}
                    onClick={() => showToast('View payment details modal coming soon', 'info')}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
