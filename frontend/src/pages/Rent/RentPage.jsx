/**
 * RentPage.jsx — now labelled "Payments"
 *
 * In the RoomLink data model:
 *   - Bills  → financial obligations (electricity, water, rent etc.)
 *   - Payments → payments made against Bills
 *
 * There is NO standalone Rent model in the database.
 * This page represents Payments against Bills and will connect to:
 *   - GET /api/spaces/:spaceId/bills (when Bill API is implemented)
 *   - GET /api/bills/:billId/payments (when Payment API is implemented)
 *
 * Current state: 🟡 MOCK DATA — APIs not yet implemented.
 */
import { useState } from 'react';
import styles from './RentPage.module.css';
import Tabs from '../../components/common/Tabs';
import Badge from '../../components/common/Badge';
import { useToast } from '../../contexts/ToastContext';

// 🟡 MOCK DATA — Replace with Bill API when available
const RENT_METRICS = {
  expected: 18500,
  collected: 12300,
  pending: 4200,
  overdue: 2000,
};

// 🟡 MOCK DATA — Replace with Payment API (GET /api/bills/:id/payments)
const MOCK_PAYMENTS = [
  { id: 'p1', member: 'Member A', billTitle: 'October Rent', amount: 6200, dueDate: '2024-10-01', status: 'Paid',    paidDate: '2024-09-28' },
  { id: 'p2', member: 'Member B', billTitle: 'October Rent', amount: 6200, dueDate: '2024-10-01', status: 'Paid',    paidDate: '2024-10-01' },
  { id: 'p3', member: 'Member C', billTitle: 'October Rent', amount: 6100, dueDate: '2024-10-01', status: 'Overdue', paidDate: null },
  { id: 'p4', member: 'Member D', billTitle: 'October Rent', amount: 5500, dueDate: '2024-10-01', status: 'Pending', paidDate: null },
  { id: 'p5', member: 'Member A', billTitle: 'September Rent', amount: 6200, dueDate: '2024-09-01', status: 'Paid',  paidDate: '2024-08-30' },
  { id: 'p6', member: 'Member B', billTitle: 'September Rent', amount: 6200, dueDate: '2024-09-01', status: 'Paid',  paidDate: '2024-09-02' },
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
    const isCurrentMonth = payment.dueDate.startsWith('2024-10');
    if (activeTab === 'current' && !isCurrentMonth) return false;
    if (activeTab === 'history' && isCurrentMonth) return false;
    if (statusFilter !== 'All' && payment.status !== statusFilter) return false;
    return true;
  });

  const getStatusVariant = (status) => {
    switch (status) {
      case 'Paid':    return 'success';
      case 'Pending': return 'warning';
      case 'Overdue': return 'danger';
      default:        return 'neutral';
    }
  };

  const progressPercentage = Math.min((RENT_METRICS.collected / RENT_METRICS.expected) * 100, 100);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Payments</h1>
          <p className={styles.subtitle}>Track bill payments and payment history for your space.</p>
        </div>
        <button
          className={styles.primaryButton}
          onClick={() => showToast('Record payment — coming soon when Bill/Payment APIs are ready', 'info')}
        >
          Record Payment
        </button>
      </header>

      {/* ── API Status Notice ── */}
      <div style={{
        background: 'color-mix(in srgb, var(--color-info, #3b82f6) 8%, transparent)',
        border: '1px solid color-mix(in srgb, var(--color-info, #3b82f6) 30%, transparent)',
        borderRadius: 'var(--radius-md)',
        padding: 'var(--space-3) var(--space-4)',
        marginBottom: 'var(--space-4)',
        fontSize: 'var(--text-sm)',
        color: 'var(--color-text-muted)',
        display: 'flex',
        gap: 'var(--space-2)',
        alignItems: 'center',
      }}>
        <span>ℹ️</span>
        <span>
          Payments are tracked against <strong>Bills</strong> in the database.
          Bill and Payment APIs are not yet implemented — the figures below are
          <strong> preview mock data</strong>.
        </span>
      </div>

      {/* ── Summary Metrics ── */}
      <div className={styles.metricsGrid}>
        <div className={styles.metricCard}>
          <div className={styles.metricLabel}>Total Expected</div>
          <div className={styles.metricValue}>₹{RENT_METRICS.expected.toLocaleString()}</div>
        </div>
        <div className={styles.metricCard}>
          <div className={styles.metricLabel}>Collected</div>
          <div className={`${styles.metricValue} ${styles.successText}`}>₹{RENT_METRICS.collected.toLocaleString()}</div>
        </div>
        <div className={styles.metricCard}>
          <div className={styles.metricLabel}>Pending</div>
          <div className={`${styles.metricValue} ${styles.warningText}`}>₹{RENT_METRICS.pending.toLocaleString()}</div>
        </div>
        <div className={styles.metricCard}>
          <div className={styles.metricLabel}>Overdue</div>
          <div className={`${styles.metricValue} ${styles.dangerText}`}>₹{RENT_METRICS.overdue.toLocaleString()}</div>
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
              <th>Member</th>
              <th>Bill</th>
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
                <td className={styles.residentName}>{payment.member}</td>
                <td>{payment.billTitle}</td>
                <td className={styles.amount}>₹{payment.amount.toLocaleString()}</td>
                <td>{payment.dueDate}</td>
                <td><Badge variant={getStatusVariant(payment.status)}>{payment.status}</Badge></td>
                <td className={styles.dateCell}>{payment.paidDate || '—'}</td>
                <td>
                  <button
                    className={styles.textButton}
                    onClick={() => showToast('Payment details — coming soon when API is ready', 'info')}
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
