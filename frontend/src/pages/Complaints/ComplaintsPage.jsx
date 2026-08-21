/**
 * ComplaintsPage.jsx
 * Manages complaints for the current space.
 *
 * Real API:
 *   GET    /api/spaces/:spaceId/complaints               — list
 *   POST   /api/spaces/:spaceId/complaints               — create (any active member)
 *   PATCH  /api/spaces/:spaceId/complaints/:complaintId  — update
 *   DELETE /api/spaces/:spaceId/complaints/:complaintId  — delete (owner/admin)
 *
 * Complaint model: type, title, description, status, raised_by, created_at, resolved_at
 * Valid statuses: 'open', 'in_progress', 'resolved', 'closed'
 */
import { useState, useEffect, useCallback } from 'react';
import styles from './ComplaintsPage.module.css';
import Tabs from '../../components/common/Tabs';
import Badge from '../../components/common/Badge';
import { useToast } from '../../contexts/ToastContext';
import { useSpace } from '../../contexts/SpaceContext';
import { getComplaints, createComplaint, updateComplaint, deleteComplaint } from '../../services/complaintService';

const TABS = [
  { id: 'open', label: 'Open Issues' },
  { id: 'in_progress', label: 'In Progress' },
  { id: 'resolved', label: 'Resolved' },
];

const STATUS_VARIANTS = {
  open: 'danger',
  in_progress: 'warning',
  resolved: 'success',
  closed: 'neutral',
};

const STATUS_LABELS = {
  open: 'Open',
  in_progress: 'In Progress',
  resolved: 'Resolved',
  closed: 'Closed',
};

function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function ComplaintsPage() {
  const [activeTab, setActiveTab] = useState('open');
  const [complaints, setComplaints] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const { showToast } = useToast();
  const { currentSpace, isAdmin } = useSpace();
  const spaceId = currentSpace?._id || currentSpace?.id;

  const fetchComplaints = useCallback(async () => {
    if (!spaceId) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await getComplaints(spaceId);
      setComplaints(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Failed to load complaints');
      setComplaints([]);
    } finally {
      setIsLoading(false);
    }
  }, [spaceId]);

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  const filteredComplaints = complaints.filter(c => {
    if (activeTab === 'open') return c.status === 'open';
    if (activeTab === 'in_progress') return c.status === 'in_progress';
    if (activeTab === 'resolved') return c.status === 'resolved' || c.status === 'closed';
    return true;
  });

  const handleStatusChange = async (complaint, newStatus) => {
    setUpdatingId(complaint._id);
    try {
      await updateComplaint(spaceId, complaint._id, { status: newStatus });
      showToast(`Complaint updated to ${STATUS_LABELS[newStatus] || newStatus}`, 'success');
      fetchComplaints();
    } catch (err) {
      showToast(err.message || 'Failed to update complaint', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (complaint) => {
    if (!window.confirm(`Delete complaint "${complaint.title}"?`)) return;
    try {
      await deleteComplaint(spaceId, complaint._id);
      showToast('Complaint deleted', 'success');
      fetchComplaints();
    } catch (err) {
      showToast(err.message || 'Failed to delete complaint', 'error');
    }
  };

  if (!currentSpace) {
    return (
      <div className={styles.container}>
        <div style={{ padding: 'var(--space-8)', textAlign: 'center', color: 'var(--color-text-muted)' }}>
          Select a space from the sidebar to view complaints.
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Issues & Complaints</h1>
          <p className={styles.subtitle}>Track maintenance requests and member concerns.</p>
        </div>
        <button
          className={styles.primaryButton}
          onClick={() => setShowCreateModal(true)}
        >+ Report Issue</button>
      </header>

      <Tabs tabs={TABS} activeTab={activeTab} onChange={(tab) => setActiveTab(tab)} />

      <div className={styles.tableWrapper}>
        {isLoading ? (
          <div style={{ padding: 'var(--space-8)', textAlign: 'center', color: 'var(--color-text-muted)' }}>
            Loading complaints…
          </div>
        ) : error ? (
          <div style={{ padding: 'var(--space-8)', textAlign: 'center', color: 'var(--color-danger)' }}>
            {error}
          </div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Title</th>
                <th>Type</th>
                <th>Reporter</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredComplaints.length > 0 ? (
                filteredComplaints.map(complaint => {
                  const reporter = complaint.raised_by?.name || complaint.raised_by?.email || 'Unknown';
                  return (
                    <tr key={complaint._id}>
                      <td className={styles.issueTitle}>{complaint.title}</td>
                      <td><Badge variant="neutral">{complaint.type}</Badge></td>
                      <td>
                        <div className={styles.reporter}>
                          <span className={styles.name}>{reporter}</span>
                        </div>
                      </td>
                      <td>
                        <Badge variant={STATUS_VARIANTS[complaint.status] || 'neutral'}>
                          {STATUS_LABELS[complaint.status] || complaint.status}
                        </Badge>
                      </td>
                      <td className={styles.dateCell}>{formatDate(complaint.created_at)}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                          {isAdmin() && complaint.status !== 'resolved' && complaint.status !== 'closed' && (
                            <select
                              value={complaint.status}
                              onChange={e => handleStatusChange(complaint, e.target.value)}
                              disabled={updatingId === complaint._id}
                              className={styles.filterSelect}
                              style={{ padding: '4px 8px', fontSize: 'var(--text-xs)' }}
                            >
                              <option value="open">Open</option>
                              <option value="in_progress">In Progress</option>
                              <option value="resolved">Resolved</option>
                              <option value="closed">Closed</option>
                            </select>
                          )}
                          {isAdmin() && (
                            <button
                              className={styles.textButton}
                              style={{ color: 'var(--color-danger)' }}
                              onClick={() => handleDelete(complaint)}
                            >Delete</button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className={styles.emptyRow}>
                    No {activeTab.replace('_', ' ')} issues found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {showCreateModal && (
        <CreateComplaintModal
          spaceId={spaceId}
          onClose={() => setShowCreateModal(false)}
          onCreated={() => { setShowCreateModal(false); fetchComplaints(); }}
          showToast={showToast}
        />
      )}
    </div>
  );
}

// ── Create Complaint Modal ───────────────────────────────────────────────────
function CreateComplaintModal({ spaceId, onClose, onCreated, showToast }) {
  const [type, setType] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!type.trim()) { showToast('Type is required', 'error'); return; }
    if (!title.trim()) { showToast('Title is required', 'error'); return; }
    if (!description.trim()) { showToast('Description is required', 'error'); return; }

    setIsSubmitting(true);
    try {
      await createComplaint(spaceId, {
        type: type.trim(),
        title: title.trim(),
        description: description.trim(),
      });
      showToast('Complaint filed successfully', 'success');
      onCreated();
    } catch (err) {
      showToast(err.message || 'Failed to file complaint', 'error');
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
        <h2 style={{ marginBottom: 'var(--space-4)', fontSize: 'var(--text-lg)', fontWeight: 600 }}>Report Issue</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div className="auth-field">
            <label className="auth-label">Type *</label>
            <select className="auth-input" value={type} onChange={e => setType(e.target.value)} disabled={isSubmitting}>
              <option value="">Select type…</option>
              <option value="maintenance">Maintenance</option>
              <option value="noise">Noise</option>
              <option value="cleanliness">Cleanliness</option>
              <option value="safety">Safety</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="auth-field">
            <label className="auth-label">Title *</label>
            <input className="auth-input" value={title} onChange={e => setTitle(e.target.value)} disabled={isSubmitting} placeholder="Brief summary of the issue" />
          </div>
          <div className="auth-field">
            <label className="auth-label">Description *</label>
            <textarea className="auth-input" value={description} onChange={e => setDescription(e.target.value)} disabled={isSubmitting} placeholder="Describe the issue in detail" rows={3} style={{ resize: 'vertical' }} />
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end' }}>
            <button type="button" className="rl-btn" onClick={onClose} disabled={isSubmitting}>Cancel</button>
            <button type="submit" className="rl-btn rl-btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Filing…' : 'File Complaint'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
