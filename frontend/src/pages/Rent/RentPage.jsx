/**
 * RentPage.jsx — labelled "Payments"
 *
 * Shows bills with their payments. Uses real APIs:
 *   GET /api/spaces/:spaceId/bills              — list bills
 *   GET /api/spaces/:spaceId/bills/:billId/payments — list payments for a bill
 *   POST /api/spaces/:spaceId/bills/:billId/payments — record a payment
 *
 * There is NO standalone Rent model. This page maps Bill + Payment together.
 */
import { useState, useEffect, useCallback } from 'react';
import styles from './RentPage.module.css';
import Tabs from '../../components/common/Tabs';
import Badge from '../../components/common/Badge';
import { useToast } from '../../contexts/ToastContext';
import { useSpace } from '../../contexts/SpaceContext';
import { getBills } from '../../services/billService';
import { getPayments, createPayment } from '../../services/paymentService';

const TABS = [
  { id: 'overview', label: 'Bill Overview' },
  { id: 'payments', label: 'Payment History' },
];

function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatCurrency(amount) {
  return `₹${Number(amount || 0).toLocaleString()}`;
}

export default function RentPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [bills, setBills] = useState([]);
  const [paymentsMap, setPaymentsMap] = useState({}); // billId → Payment[]
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPayModal, setShowPayModal] = useState(null); // bill object or null
  const { showToast } = useToast();
  const { currentSpace } = useSpace();
  const spaceId = currentSpace?._id || currentSpace?.id;

  const fetchData = useCallback(async () => {
    if (!spaceId) return;
    setIsLoading(true);
    setError(null);
    try {
      const billsData = await getBills(spaceId);
      const billList = Array.isArray(billsData) ? billsData : [];
      setBills(billList);

      // Fetch payments for each bill
      const pMap = {};
      await Promise.all(
        billList.map(async (bill) => {
          try {
            const payments = await getPayments(spaceId, bill._id);
            pMap[bill._id] = Array.isArray(payments) ? payments : [];
          } catch {
            pMap[bill._id] = [];
          }
        })
      );
      setPaymentsMap(pMap);
    } catch (err) {
      setError(err.message || 'Failed to load data');
      setBills([]);
    } finally {
      setIsLoading(false);
    }
  }, [spaceId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ── Compute summary metrics ──
  const totalExpected = bills.reduce((sum, b) => sum + (b.amount || 0), 0);
  const totalPaid = Object.values(paymentsMap).flat().reduce((sum, p) => sum + (p.amount || 0), 0);
  const totalPending = Math.max(totalExpected - totalPaid, 0);
  const progressPct = totalExpected > 0 ? Math.min((totalPaid / totalExpected) * 100, 100) : 0;

  // All payments flat list
  const allPayments = bills.flatMap(bill =>
    (paymentsMap[bill._id] || []).map(p => ({ ...p, billTitle: bill.title, billDueDate: bill.due_date }))
  );

  if (!currentSpace) {
    return (
      <div className={styles.container}>
        <div style={{ padding: 'var(--space-8)', textAlign: 'center', color: 'var(--color-text-muted)' }}>
          Select a space from the sidebar to view payments.
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Payments</h1>
          <p className={styles.subtitle}>Track bill payments and payment history for your space.</p>
        </div>
      </header>

      {/* ── Summary Metrics ── */}
      <div className={styles.metricsGrid}>
        <div className={styles.metricCard}>
          <div className={styles.metricLabel}>Total Billed</div>
          <div className={styles.metricValue}>{formatCurrency(totalExpected)}</div>
        </div>
        <div className={styles.metricCard}>
          <div className={styles.metricLabel}>Total Paid</div>
          <div className={`${styles.metricValue} ${styles.successText}`}>{formatCurrency(totalPaid)}</div>
        </div>
        <div className={styles.metricCard}>
          <div className={styles.metricLabel}>Remaining</div>
          <div className={`${styles.metricValue} ${styles.warningText}`}>{formatCurrency(totalPending)}</div>
        </div>
        <div className={styles.metricCard}>
          <div className={styles.metricLabel}>Bills</div>
          <div className={styles.metricValue}>{bills.length}</div>
        </div>
      </div>

      <div className={styles.progressContainer}>
        <div className={styles.progressHeader}>
          <span>Collection Progress</span>
          <span>{Math.round(progressPct)}%</span>
        </div>
        <div className={styles.progressBarBg}>
          <div className={styles.progressBarFill} style={{ width: `${progressPct}%` }} />
        </div>
      </div>

      <Tabs tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />

      <div style={{ marginTop: 'var(--space-4)' }}>
        {isLoading ? (
          <div style={{ padding: 'var(--space-8)', textAlign: 'center', color: 'var(--color-text-muted)' }}>
            Loading payments data…
          </div>
        ) : error ? (
          <div style={{ padding: 'var(--space-8)', textAlign: 'center', color: 'var(--color-danger)' }}>
            {error}
          </div>
        ) : activeTab === 'overview' ? (
          /* ── Bill Overview ── */
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Bill</th>
                  <th>Amount</th>
                  <th>Due Date</th>
                  <th>Paid</th>
                  <th>Remaining</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bills.length > 0 ? bills.map(bill => {
                  const payments = paymentsMap[bill._id] || [];
                  const paidSum = payments.reduce((s, p) => s + (p.amount || 0), 0);
                  const remaining = Math.max(bill.amount - paidSum, 0);
                  const isPaid = remaining === 0;
                  return (
                    <tr key={bill._id}>
                      <td className={styles.residentName}>{bill.title}</td>
                      <td className={styles.amount}>{formatCurrency(bill.amount)}</td>
                      <td>{formatDate(bill.due_date)}</td>
                      <td>
                        <Badge variant={isPaid ? 'success' : 'warning'}>
                          {formatCurrency(paidSum)}
                        </Badge>
                      </td>
                      <td className={styles.amount}>
                        {isPaid ? '✓ Paid' : formatCurrency(remaining)}
                      </td>
                      <td>
                        {!isPaid && (
                          <button
                            className={styles.textButton}
                            onClick={() => setShowPayModal(bill)}
                          >
                            Record Payment
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                }) : (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: 'var(--space-6)', color: 'var(--color-text-muted)' }}>
                      No bills found. Create a bill from the Bills page first.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          /* ── Payment History ── */
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Paid By</th>
                  <th>Bill</th>
                  <th>Amount</th>
                  <th>Method</th>
                  <th>Paid On</th>
                </tr>
              </thead>
              <tbody>
                {allPayments.length > 0 ? allPayments.map(payment => (
                  <tr key={payment._id}>
                    <td className={styles.residentName}>
                      {payment.paid_by?.name || payment.paid_by?.email || 'Unknown'}
                    </td>
                    <td>{payment.billTitle}</td>
                    <td className={styles.amount}>{formatCurrency(payment.amount)}</td>
                    <td>{payment.method || '—'}</td>
                    <td className={styles.dateCell}>{formatDate(payment.paid_at)}</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: 'var(--space-6)', color: 'var(--color-text-muted)' }}>
                      No payments recorded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showPayModal && (
        <RecordPaymentModal
          spaceId={spaceId}
          bill={showPayModal}
          onClose={() => setShowPayModal(null)}
          onCreated={() => { setShowPayModal(null); fetchData(); }}
          showToast={showToast}
        />
      )}
    </div>
  );
}

// ── Record Payment Modal ─────────────────────────────────────────────────────
function RecordPaymentModal({ spaceId, bill, onClose, onCreated, showToast }) {
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) { showToast('Valid amount is required', 'error'); return; }
    if (!method.trim()) { showToast('Payment method is required', 'error'); return; }

    setIsSubmitting(true);
    try {
      await createPayment(spaceId, bill._id, {
        amount: Number(amount),
        method: method.trim(),
        transaction_id: transactionId.trim() || undefined,
      });
      showToast('Payment recorded successfully', 'success');
      onCreated();
    } catch (err) {
      showToast(err.message || 'Failed to record payment', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)' }} onClick={onClose} />
      <div style={{
        position: 'relative', background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-6)', width: '100%', maxWidth: 440, boxShadow: 'var(--shadow-xl)',
      }}>
        <h2 style={{ marginBottom: 'var(--space-2)', fontSize: 'var(--text-lg)', fontWeight: 600 }}>Record Payment</h2>
        <p style={{ marginBottom: 'var(--space-4)', fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
          For: {bill.title} ({formatCurrency(bill.amount)})
        </p>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div className="auth-field">
            <label className="auth-label">Amount (₹) *</label>
            <input className="auth-input" type="number" min="0" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} disabled={isSubmitting} placeholder="0.00" />
          </div>
          <div className="auth-field">
            <label className="auth-label">Payment Method *</label>
            <select className="auth-input" value={method} onChange={e => setMethod(e.target.value)} disabled={isSubmitting}>
              <option value="">Select method…</option>
              <option value="cash">Cash</option>
              <option value="upi">UPI</option>
              <option value="bank_transfer">Bank Transfer</option>
              <option value="card">Card</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="auth-field">
            <label className="auth-label">Transaction ID <span style={{color:'var(--color-text-muted)', fontWeight:400}}>(optional)</span></label>
            <input className="auth-input" value={transactionId} onChange={e => setTransactionId(e.target.value)} disabled={isSubmitting} placeholder="e.g. UPI ref number" />
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end' }}>
            <button type="button" className="rl-btn" onClick={onClose} disabled={isSubmitting}>Cancel</button>
            <button type="submit" className="rl-btn rl-btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Recording…' : 'Record Payment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
