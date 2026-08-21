import { useState } from 'react';
import { useSpace } from '../../contexts/SpaceContext';
import { ApiError } from '../../services/api';

const SPACE_TYPES = ['Apartment', 'PG', 'Hostel', 'Shared House', 'Other'];

export default function CreateSpaceModal({ onClose, onSuccess, showToast }) {
  const { createNewSpace } = useSpace();
  const [spaceName, setSpaceName] = useState('');
  const [spaceType, setSpaceType] = useState('Apartment');
  const [spaceAddress, setSpaceAddress] = useState('');
  const [spaceDescription, setSpaceDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!spaceName.trim() || !spaceAddress.trim()) {
      showToast('Name and address are required.', 'error');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const newSpace = await createNewSpace({
        name: spaceName.trim(),
        type: spaceType,
        address: spaceAddress.trim(),
        description: spaceDescription.trim() || undefined,
      });
      showToast('Space created successfully', 'success');
      if (onSuccess) onSuccess(newSpace);
      onClose();
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 0) {
          showToast('Cannot reach the server.', 'error');
        } else {
          showToast(err.message || 'Failed to create space.', 'error');
        }
      } else {
        showToast('An unexpected error occurred.', 'error');
      }
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
        <h2 style={{ marginBottom: 'var(--space-2)', fontSize: 'var(--text-lg)', fontWeight: 600 }}>Create New Space</h2>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-4)' }}>
          Set up your shared living space. You can invite residents later.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div className="auth-field">
            <label htmlFor="modalSpaceName" className="auth-label">Space Name <span style={{color:'var(--color-danger)'}}>*</span></label>
            <input
              id="modalSpaceName"
              className="auth-input"
              placeholder="e.g. The Sunnydale House"
              value={spaceName}
              onChange={e => setSpaceName(e.target.value)}
              disabled={isSubmitting}
            />
          </div>
          
          <div className="auth-field">
            <label htmlFor="modalSpaceType" className="auth-label">Type</label>
            <select
              id="modalSpaceType"
              className="auth-input"
              value={spaceType}
              onChange={e => setSpaceType(e.target.value)}
              disabled={isSubmitting}
            >
              {SPACE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          
          <div className="auth-field">
            <label htmlFor="modalSpaceAddress" className="auth-label">Address <span style={{color:'var(--color-danger)'}}>*</span></label>
            <input
              id="modalSpaceAddress"
              className="auth-input"
              placeholder="e.g. 42 Park Street, Bangalore"
              value={spaceAddress}
              onChange={e => setSpaceAddress(e.target.value)}
              disabled={isSubmitting}
            />
          </div>
          
          <div className="auth-field">
            <label htmlFor="modalSpaceDesc" className="auth-label">Description <span style={{color:'var(--color-text-muted)', fontWeight:400}}>(optional)</span></label>
            <input
              id="modalSpaceDesc"
              className="auth-input"
              placeholder="A brief description of the space"
              value={spaceDescription}
              onChange={e => setSpaceDescription(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end', marginTop: 'var(--space-2)' }}>
            <button type="button" className="rl-btn" onClick={onClose} disabled={isSubmitting}>Cancel</button>
            <button type="submit" className="rl-btn rl-btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Creating…' : 'Create Space'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
