import { useState } from 'react';
import { createChore } from '../../services/choreService';

export default function CreateChoreModal({ spaceId, members, onClose, onCreated, showToast }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) { showToast('Title is required', 'error'); return; }

    setIsSubmitting(true);
    try {
      await createChore(spaceId, {
        title: title.trim(),
        description: description.trim() || undefined,
        assigned_to: assignedTo || undefined,
        due_date: dueDate || undefined,
      });
      showToast('Chore created successfully', 'success');
      onCreated();
    } catch (err) {
      showToast(err.message || 'Failed to create chore', 'error');
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
        <h2 style={{ marginBottom: 'var(--space-4)', fontSize: 'var(--text-lg)', fontWeight: 600 }}>Assign Chore</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div className="auth-field">
            <label className="auth-label">Title *</label>
            <input className="auth-input" value={title} onChange={e => setTitle(e.target.value)} disabled={isSubmitting} placeholder="e.g. Take out the trash" />
          </div>
          <div className="auth-field">
            <label className="auth-label">Description</label>
            <input className="auth-input" value={description} onChange={e => setDescription(e.target.value)} disabled={isSubmitting} placeholder="Optional details" />
          </div>
          <div className="auth-field">
            <label className="auth-label">Assign To</label>
            <select className="auth-input" value={assignedTo} onChange={e => setAssignedTo(e.target.value)} disabled={isSubmitting}>
              <option value="">Unassigned</option>
              {members.map(m => {
                const u = m.user_id || m.user || {};
                const id = u._id || u.id;
                return <option key={id} value={id}>{u.name || u.email || 'Unknown'}</option>;
              })}
            </select>
          </div>
          <div className="auth-field">
            <label className="auth-label">Due Date</label>
            <input className="auth-input" type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} disabled={isSubmitting} />
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end' }}>
            <button type="button" className="rl-btn" onClick={onClose} disabled={isSubmitting}>Cancel</button>
            <button type="submit" className="rl-btn rl-btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Creating…' : 'Create Chore'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
