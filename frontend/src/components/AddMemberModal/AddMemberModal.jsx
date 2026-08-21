import { useState } from 'react';

export default function AddMemberModal({ onClose, onAdded, showToast, addSpaceMember }) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('member');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) { showToast('Email is required', 'error'); return; }

    setIsSubmitting(true);
    try {
      await addSpaceMember(email.trim(), role);
      showToast('Member added successfully', 'success');
      onAdded();
    } catch (err) {
      showToast(err.message || 'Failed to add member', 'error');
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
        <h2 style={{ marginBottom: 'var(--space-4)', fontSize: 'var(--text-lg)', fontWeight: 600 }}>Add Member</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div className="auth-field">
            <label className="auth-label">Email Address *</label>
            <input type="email" className="auth-input" value={email} onChange={e => setEmail(e.target.value)} disabled={isSubmitting} placeholder="Enter the user's email" />
            <p style={{fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: 4}}>The user must be registered in RoomLink.</p>
          </div>
          <div className="auth-field">
            <label className="auth-label">Role</label>
            <select className="auth-input" value={role} onChange={e => setRole(e.target.value)} disabled={isSubmitting}>
              <option value="admin">Admin</option>
              <option value="member">Member</option>
            </select>
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end' }}>
            <button type="button" className="rl-btn" onClick={onClose} disabled={isSubmitting}>Cancel</button>
            <button type="submit" className="rl-btn rl-btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Adding…' : 'Add Member'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
