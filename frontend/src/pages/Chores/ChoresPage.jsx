/**
 * ChoresPage.jsx
 * Manages chores for the current space.
 *
 * Real API:
 *   GET    /api/spaces/:spaceId/chores            — list chores
 *   POST   /api/spaces/:spaceId/chores            — create (owner/admin)
 *   PATCH  /api/spaces/:spaceId/chores/:choreId   — update (owner/admin)
 *   DELETE /api/spaces/:spaceId/chores/:choreId   — delete (owner/admin)
 *
 * Chore model: title, description, assigned_to, due_date, status, created_by
 * Valid statuses: 'pending', 'in_progress', 'done'
 */
import { useState, useEffect, useCallback } from 'react';
import styles from './ChoresPage.module.css';
import Badge from '../../components/common/Badge';
import { useToast } from '../../contexts/ToastContext';
import { useSpace } from '../../contexts/SpaceContext';
import { getChores, createChore, updateChore, deleteChore } from '../../services/choreService';

const STATUS_CONFIG = {
  pending: { label: 'Pending', variant: 'warning' },
  in_progress: { label: 'In Progress', variant: 'info' },
  done: { label: 'Done', variant: 'success' },
};

export default function ChoresPage() {
  const [chores, setChores] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { showToast } = useToast();
  const { currentSpace, members, isAdmin } = useSpace();
  const spaceId = currentSpace?._id || currentSpace?.id;

  const fetchChores = useCallback(async () => {
    if (!spaceId) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await getChores(spaceId);
      setChores(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Failed to load chores');
      setChores([]);
    } finally {
      setIsLoading(false);
    }
  }, [spaceId]);

  useEffect(() => {
    fetchChores();
  }, [fetchChores]);

  const handleStatusChange = async (chore, newStatus) => {
    setUpdatingId(chore._id);
    try {
      await updateChore(spaceId, chore._id, { status: newStatus });
      showToast(`Chore marked as ${STATUS_CONFIG[newStatus]?.label || newStatus}`, 'success');
      fetchChores();
    } catch (err) {
      showToast(err.message || 'Failed to update chore', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (chore) => {
    if (!window.confirm(`Delete chore "${chore.title}"?`)) return;
    try {
      await deleteChore(spaceId, chore._id);
      showToast('Chore deleted', 'success');
      fetchChores();
    } catch (err) {
      showToast(err.message || 'Failed to delete chore', 'error');
    }
  };

  const getAssigneeName = (chore) => {
    const assignee = chore.assigned_to;
    if (!assignee) return 'Unassigned';
    return assignee.name || assignee.email || 'Unknown';
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const renderColumn = (title, status) => {
    const columnChores = chores.filter(c => c.status === status);

    return (
      <div className={styles.column}>
        <div className={styles.columnHeader}>
          <h2 className={styles.columnTitle}>{title}</h2>
          <span className={styles.columnCount}>{columnChores.length}</span>
        </div>

        <div className={styles.columnContent}>
          {isLoading ? (
            <div className={styles.emptyColumn}>Loading…</div>
          ) : columnChores.length > 0 ? (
            columnChores.map(chore => (
              <div
                key={chore._id}
                className={`${styles.card} ${updatingId === chore._id ? styles.completing : ''}`}
              >
                <div className={styles.cardHeader}>
                  <h3 className={styles.cardTitle}>{chore.title}</h3>
                  <Badge variant={STATUS_CONFIG[chore.status]?.variant || 'neutral'}>
                    {STATUS_CONFIG[chore.status]?.label || chore.status}
                  </Badge>
                </div>

                <div className={styles.cardBody}>
                  <div className={styles.assignee}>
                    <div className={styles.avatar}>{getAssigneeName(chore).charAt(0)}</div>
                    <span>{getAssigneeName(chore)}</span>
                  </div>
                  <div className={styles.details}>
                    <span>📅 {formatDate(chore.due_date)}</span>
                  </div>
                  {chore.description && (
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: 'var(--space-2)' }}>
                      {chore.description}
                    </p>
                  )}
                </div>

                <div className={styles.cardFooter}>
                  {status !== 'done' && (
                    <button
                      className={styles.completeButton}
                      onClick={() => handleStatusChange(chore, status === 'pending' ? 'in_progress' : 'done')}
                      disabled={updatingId === chore._id}
                    >
                      {status === 'pending' ? '▶ Start' : '✓ Mark Done'}
                    </button>
                  )}
                  {isAdmin() && (
                    <button
                      className={styles.completeButton}
                      style={{ color: 'var(--color-danger)', background: 'none' }}
                      onClick={() => handleDelete(chore)}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className={styles.emptyColumn}>
              No {title.toLowerCase()} chores
            </div>
          )}
        </div>
      </div>
    );
  };

  if (!currentSpace) {
    return (
      <div className={styles.container}>
        <div style={{ padding: 'var(--space-8)', textAlign: 'center', color: 'var(--color-text-muted)' }}>
          Select a space from the sidebar to view chores.
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <header className={styles.header}>
          <div>
            <h1 className={styles.title}>Chores & Tasks</h1>
            <p className={styles.subtitle}>Track shared responsibilities and cleaning schedules.</p>
          </div>
        </header>
        <div style={{ padding: 'var(--space-8)', textAlign: 'center', color: 'var(--color-danger)' }}>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Chores & Tasks</h1>
          <p className={styles.subtitle}>Track shared responsibilities and cleaning schedules.</p>
        </div>
        {isAdmin() && (
          <button
            className={styles.primaryButton}
            onClick={() => setShowCreateModal(true)}
          >
            + Assign Chore
          </button>
        )}
      </header>

      <div className={styles.board}>
        {renderColumn('Pending', 'pending')}
        {renderColumn('In Progress', 'in_progress')}
        {renderColumn('Completed', 'done')}
      </div>

      {showCreateModal && (
        <CreateChoreModal
          spaceId={spaceId}
          members={members}
          onClose={() => setShowCreateModal(false)}
          onCreated={() => { setShowCreateModal(false); fetchChores(); }}
          showToast={showToast}
        />
      )}
    </div>
  );
}

// ── Create Chore Modal ───────────────────────────────────────────────────────
function CreateChoreModal({ spaceId, members, onClose, onCreated, showToast }) {
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
        position: 'relative', background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)',
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
