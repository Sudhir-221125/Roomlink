import { useState } from 'react';
import { createBill } from '../../services/billService';

export default function CreateBillModal({ spaceId, onClose, onCreated, showToast }) {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) { showToast('Title is required', 'error'); return; }
    if (!amount || Number(amount) < 0) { showToast('Valid amount is required', 'error'); return; }
    if (!dueDate) { showToast('Due date is required', 'error'); return; }

    setIsSubmitting(true);
    try {
      await createBill(spaceId, {
        title: title.trim(),
        amount: Number(amount),
        due_date: dueDate,
      });
      showToast('Bill created successfully', 'success');
      onCreated();
    } catch (err) {
      showToast(err.message || 'Failed to create bill', 'error');
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
        position: 'relative', background: 'var(--glass-overlay-bg)', backdropFilter: 'var(--glass-overlay-blur)', WebkitBackdropFilter: 'var(--glass-overlay-blur)', border: 'var(--glass-border)', borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-6)', width: '100%', maxWidth: 440, boxShadow: 'var(--shadow-xl)',
      }}>
        <h2 style={{ marginBottom: 'var(--space-4)', fontSize: 'var(--text-lg)', fontWeight: 600 }}>Add Bill</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div className="auth-field">
            <label className="auth-label">Title *</label>
            <input className="auth-input" value={title} onChange={e => setTitle(e.target.value)} disabled={isSubmitting} placeholder="e.g. Electricity Bill" />
          </div>
          <div className="auth-field">
            <label className="auth-label">Amount (₹) *</label>
            <input className="auth-input" type="number" min="0" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} disabled={isSubmitting} placeholder="0.00" />
          </div>
          <div className="auth-field">
            <label className="auth-label">Due Date *</label>
            <input className="auth-input" type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} disabled={isSubmitting} />
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end' }}>
            <button type="button" className="rl-btn" onClick={onClose} disabled={isSubmitting}>Cancel</button>
            <button type="submit" className="rl-btn rl-btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Creating…' : 'Create Bill'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
