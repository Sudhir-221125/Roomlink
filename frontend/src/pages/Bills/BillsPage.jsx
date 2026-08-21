/**
 * BillsPage.jsx
 * Manages bills for the current space.
 *
 * Real API:
 *   GET    /api/spaces/:spaceId/bills          — list bills
 *   POST   /api/spaces/:spaceId/bills          — create bill (owner/admin)
 *   PATCH  /api/spaces/:spaceId/bills/:billId  — update bill (owner/admin)
 *   DELETE /api/spaces/:spaceId/bills/:billId  — delete bill (owner/admin)
 *
 * Bill model fields: title, amount, due_date, created_by, created_at
 */
import { useState, useEffect, useCallback } from 'react';
import styles from './BillsPage.module.css';
import Tabs from '../../components/common/Tabs';
import Badge from '../../components/common/Badge';
import EmptyState from '../../components/common/EmptyState';
import { useToast } from '../../contexts/ToastContext';
import { useSpace } from '../../contexts/SpaceContext';
import { getBills, deleteBill } from '../../services/billService';
import CreateBillModal from '../../components/CreateBillModal/CreateBillModal';

const TABS = [
  { id: 'active', label: 'Active Bills' },
  { id: 'history', label: 'Bill History' }
];

function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatCurrency(amount) {
  return `₹${Number(amount || 0).toLocaleString()}`;
}

export default function BillsPage() {
  const [activeTab, setActiveTab] = useState('active');
  const [bills, setBills] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const { showToast } = useToast();
  const { currentSpace, isAdmin } = useSpace();
  const spaceId = currentSpace?._id || currentSpace?.id;

  const fetchBills = useCallback(async () => {
    if (!spaceId) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await getBills(spaceId);
      setBills(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Failed to load bills');
      setBills([]);
    } finally {
      setIsLoading(false);
    }
  }, [spaceId]);

  useEffect(() => {
    fetchBills();
  }, [fetchBills]);

  const now = new Date();
  const filteredBills = bills.filter(bill => {
    const dueDate = new Date(bill.due_date);
    const isPast = dueDate < now;
    if (activeTab === 'active') return !isPast;
    return isPast;
  });

  const handleDelete = async (bill) => {
    if (!window.confirm(`Delete bill "${bill.title}"? This will also delete associated payments.`)) return;
    setDeletingId(bill._id);
    try {
      await deleteBill(spaceId, bill._id);
      showToast('Bill deleted successfully', 'success');
      fetchBills();
    } catch (err) {
      showToast(err.message || 'Failed to delete bill', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  const getStatusInfo = (bill) => {
    const dueDate = new Date(bill.due_date);
    if (dueDate < now) return { label: 'Overdue', variant: 'danger' };
    const daysLeft = Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24));
    if (daysLeft <= 3) return { label: 'Due Soon', variant: 'warning' };
    return { label: 'Upcoming', variant: 'info' };
  };

  if (!currentSpace) {
    return (
      <div className={styles.container}>
        <EmptyState title="No space selected" description="Select a space from the sidebar to view bills." />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Bills & Expenses</h1>
          <p className={styles.subtitle}>Manage shared bills, utilities, and property expenses.</p>
        </div>
        {isAdmin() && (
          <button
            className={styles.primaryButton}
            onClick={() => setShowCreateModal(true)}
          >+ Add Bill</button>
        )}
      </header>

      <Tabs tabs={TABS} activeTab={activeTab} onChange={(tab) => setActiveTab(tab)} />

      <div className={styles.content}>
        {isLoading ? (
          <div style={{ padding: 'var(--space-8)', textAlign: 'center', color: 'var(--color-text-muted)' }}>
            Loading bills…
          </div>
        ) : error ? (
          <div style={{ padding: 'var(--space-8)', textAlign: 'center', color: 'var(--color-danger)' }}>
            {error}
          </div>
        ) : filteredBills.length > 0 ? (
          <div className={styles.grid}>
            {filteredBills.map(bill => {
              const status = getStatusInfo(bill);
              const createdBy = bill.created_by?.name || 'Unknown';
              return (
                <div key={bill._id} className={styles.card}>
                  <div className={styles.cardHeader}>
                    <div className={styles.iconTitleWrapper}>
                      <span className={styles.categoryIcon}>📄</span>
                      <h3 className={styles.cardTitle}>{bill.title}</h3>
                    </div>
                    <Badge variant={status.variant}>{status.label}</Badge>
                  </div>

                  <div className={styles.cardBody}>
                    <div className={styles.amount}>{formatCurrency(bill.amount)}</div>
                    <p className={styles.detail}><strong>Due:</strong> {formatDate(bill.due_date)}</p>
                    <p className={styles.detail} style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                      Created by {createdBy}
                    </p>
                  </div>

                  <div className={styles.cardFooter}>
                    {isAdmin() && (
                      <button
                        className={styles.textButton}
                        style={{ color: 'var(--color-danger)' }}
                        onClick={() => handleDelete(bill)}
                        disabled={deletingId === bill._id}
                      >
                        {deletingId === bill._id ? 'Deleting…' : 'Delete'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState
            title="No bills found"
            description={activeTab === 'active' ? 'No upcoming bills. Add one to get started.' : 'No past bills found.'}
          />
        )}
      </div>

      {showCreateModal && (
        <CreateBillModal
          spaceId={spaceId}
          onClose={() => setShowCreateModal(false)}
          onCreated={() => { setShowCreateModal(false); fetchBills(); }}
          showToast={showToast}
        />
      )}
    </div>
  );
}

// ── Create Bill Modal ────────────────────────────────────────────────────────

