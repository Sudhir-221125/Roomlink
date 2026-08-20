/**
 * RoomsPage.jsx — repurposed as the Members & Space page.
 *
 * Tab 1 — "Members": fetches real data from GET /api/spaces/:id/members via SpaceContext.
 *   Shows: name, email, role_in_space, joined_at.
 *   Owner/admin can: add members, change roles, remove members.
 *   Member: read-only.
 *
 * Tab 2 — "Space Info": shows current Space fields (name, type, address, description).
 *   Owner/admin can edit via PATCH /api/spaces/:id.
 *   No room numbers, no room assignments — Room entity does not exist in the DB.
 *
 * NOTE: There is NO Room model in the database. This page intentionally replaces
 * the former room-centric UI with Membership-based member management.
 */
import { useState } from 'react';
import styles from './RoomsPage.module.css';
import Tabs from '../../components/common/Tabs';
import Badge from '../../components/common/Badge';
import EmptyState from '../../components/common/EmptyState';
import Skeleton from '../../components/common/Skeleton';
import { useToast } from '../../contexts/ToastContext';
import { useSpace } from '../../contexts/SpaceContext';
import { useAuth } from '../../contexts/AuthContext';

const TABS = [
  { id: 'members', label: 'Members' },
  { id: 'space', label: 'Space Info' },
];

const ROLE_COLORS = {
  owner: 'danger',
  admin: 'warning',
  member: 'neutral',
};

function roleLabel(role) {
  return role ? role.charAt(0).toUpperCase() + role.slice(1) : 'Member';
}

function getInitials(name = '') {
  return name
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={styles.icon}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
  </svg>
);

// ── Members Tab ──────────────────────────────────────────────────────────────
function MembersTab() {
  const { showToast } = useToast();
  const {
    members,
    isLoadingMembers,
    canAddMembers,
    canManageRoles,
    removeSpaceMember,
    changeMemberRole,
    fetchMembers,
  } = useSpace();
  const { user } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [removingId, setRemovingId] = useState(null);

  const filteredMembers = members.filter(m => {
    const memberUser = m.user_id || m.user || {};
    const name = memberUser.name || '';
    const email = memberUser.email || '';
    const matchSearch = name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchRole = roleFilter === 'All' || m.role_in_space === roleFilter.toLowerCase();
    return matchSearch && matchRole;
  });

  const handleRemove = async (membership) => {
    const memberUser = membership.user_id || membership.user || {};
    const memberId = memberUser._id || memberUser.id;
    const memberName = memberUser.name || 'this member';

    if (!window.confirm(`Remove ${memberName} from this space?`)) return;
    setRemovingId(memberId);
    try {
      await removeSpaceMember(memberId);
      showToast(`${memberName} removed from space`, 'success');
    } catch (err) {
      showToast(err.message || 'Failed to remove member', 'error');
    } finally {
      setRemovingId(null);
    }
  };

  const handleRoleChange = async (membership, newRole) => {
    const memberUser = membership.user_id || membership.user || {};
    const memberId = memberUser._id || memberUser.id;
    const memberName = memberUser.name || 'member';
    try {
      await changeMemberRole(memberId, newRole);
      showToast(`${memberName}'s role updated to ${newRole}`, 'success');
    } catch (err) {
      showToast(err.message || 'Failed to update role', 'error');
    }
  };

  if (isLoadingMembers) {
    return (
      <div style={{ padding: 'var(--space-4) 0' }}>
        {[1,2,3].map(i => (
          <div key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
            <Skeleton width="40px" height="40px" style={{ borderRadius: '50%' }} />
            <div style={{ flex: 1 }}>
              <Skeleton width="180px" height="14px" style={{ marginBottom: '6px' }} />
              <Skeleton width="120px" height="12px" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className={styles.controls}>
        <div className={styles.searchBox}>
          <SearchIcon />
          <input
            type="text"
            placeholder="Search members…"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        <select
          value={roleFilter}
          onChange={e => setRoleFilter(e.target.value)}
          className={styles.filterSelect}
        >
          <option value="All">All Roles</option>
          <option value="Owner">Owner</option>
          <option value="Admin">Admin</option>
          <option value="Member">Member</option>
        </select>
        <button
          className={styles.primaryButton}
          onClick={() => showToast('Add member by user ID coming soon — ask your admin to use the backend API', 'info')}
          style={{ marginLeft: 'auto' }}
          disabled={!canAddMembers()}
          title={!canAddMembers() ? 'Only owner/admin can add members' : undefined}
        >
          + Add Member
        </button>
      </div>

      {filteredMembers.length > 0 ? (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Member</th>
                <th>Role</th>
                <th>Joined</th>
                {canManageRoles() && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map(membership => {
                const memberUser = membership.user_id || membership.user || {};
                const memberId = memberUser._id || memberUser.id;
                const isMe = memberId === (user?._id || user?.id);
                const joinedDate = membership.joined_at
                  ? new Date(membership.joined_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                  : '—';

                return (
                  <tr key={membership._id || memberId}>
                    <td>
                      <div className={styles.residentInfo}>
                        <div className={styles.avatar}>{getInitials(memberUser.name)}</div>
                        <div>
                          <div className={styles.resName}>
                            {memberUser.name || 'Unknown'}
                            {isMe && <span style={{ marginLeft: '0.5rem', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>(you)</span>}
                          </div>
                          <div className={styles.resEmail}>{memberUser.email || '—'}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <Badge variant={ROLE_COLORS[membership.role_in_space] || 'neutral'}>
                        {roleLabel(membership.role_in_space)}
                      </Badge>
                    </td>
                    <td>{joinedDate}</td>
                    {canManageRoles() && (
                      <td>
                        {!isMe && membership.role_in_space !== 'owner' ? (
                          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            <select
                              value={membership.role_in_space}
                              onChange={e => handleRoleChange(membership, e.target.value)}
                              className={styles.filterSelect}
                              style={{ padding: '4px 8px', fontSize: 'var(--text-xs)' }}
                            >
                              <option value="admin">Admin</option>
                              <option value="member">Member</option>
                            </select>
                            <button
                              className={styles.textButton}
                              style={{ color: 'var(--color-danger)' }}
                              onClick={() => handleRemove(membership)}
                              disabled={removingId === memberId}
                            >
                              {removingId === memberId ? '…' : 'Remove'}
                            </button>
                          </div>
                        ) : (
                          <span style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-xs)' }}>—</span>
                        )}
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState
          icon={<SearchIcon />}
          title={searchQuery || roleFilter !== 'All' ? 'No members found' : 'No members yet'}
          description={
            searchQuery || roleFilter !== 'All'
              ? "No members match your current filters."
              : "This space has no members yet. Add members to get started."
          }
        />
      )}
    </>
  );
}

// ── Space Info Tab ───────────────────────────────────────────────────────────
function SpaceInfoTab() {
  const { showToast } = useToast();
  const { currentSpace, canManageSpace, updateCurrentSpace, deleteCurrentSpace, canDeleteSpace } = useSpace();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState({
    name: currentSpace?.name || '',
    type: currentSpace?.type || '',
    address: currentSpace?.address || '',
    description: currentSpace?.description || '',
  });

  const handleEdit = () => {
    setForm({
      name: currentSpace?.name || '',
      type: currentSpace?.type || '',
      address: currentSpace?.address || '',
      description: currentSpace?.description || '',
    });
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      showToast('Space name is required', 'error');
      return;
    }
    setIsSaving(true);
    try {
      await updateCurrentSpace({
        name: form.name.trim(),
        type: form.type,
        address: form.address.trim() || undefined,
        description: form.description.trim() || undefined,
      });
      showToast('Space updated successfully', 'success');
      setIsEditing(false);
    } catch (err) {
      showToast(err.message || 'Failed to update space', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this space? This action cannot be undone.')) return;
    try {
      await deleteCurrentSpace();
      showToast('Space deleted', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to delete space', 'error');
    }
  };

  if (!currentSpace) {
    return (
      <EmptyState
        title="No space selected"
        description="Select a space from the sidebar to view details."
      />
    );
  }

  const createdDate = currentSpace.created_at
    ? new Date(currentSpace.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : '—';

  return (
    <div style={{ maxWidth: 560 }}>
      {isEditing ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div className="auth-field">
            <label className="auth-label">Space Name *</label>
            <input className="auth-input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} disabled={isSaving} />
          </div>
          <div className="auth-field">
            <label className="auth-label">Type</label>
            <select className="auth-input" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} disabled={isSaving}>
              {['Apartment','PG','Hostel','Shared House','Other'].map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="auth-field">
            <label className="auth-label">Address</label>
            <input className="auth-input" value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} disabled={isSaving} />
          </div>
          <div className="auth-field">
            <label className="auth-label">Description</label>
            <input className="auth-input" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} disabled={isSaving} />
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
            <button className="rl-btn rl-btn-primary" onClick={handleSave} disabled={isSaving}>{isSaving ? 'Saving…' : 'Save Changes'}</button>
            <button className="rl-btn" onClick={() => setIsEditing(false)} disabled={isSaving}>Cancel</button>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
            {[
              { label: 'Name', value: currentSpace.name },
              { label: 'Type', value: currentSpace.type || '—' },
              { label: 'Address', value: currentSpace.address || '—' },
              { label: 'Created', value: createdDate },
            ].map(({ label, value }) => (
              <div key={label} style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-md)', padding: 'var(--space-4)' }}>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</p>
                <p style={{ fontWeight: 500, color: 'var(--color-text)' }}>{value}</p>
              </div>
            ))}
          </div>

          {currentSpace.description && (
            <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-md)', padding: 'var(--space-4)' }}>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Description</p>
              <p style={{ color: 'var(--color-text)' }}>{currentSpace.description}</p>
            </div>
          )}

          <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
            {canManageSpace() && (
              <button className="rl-btn rl-btn-primary" onClick={handleEdit}>Edit Space</button>
            )}
            {canDeleteSpace() && (
              <button className="rl-btn" style={{ color: 'var(--color-danger)', borderColor: 'var(--color-danger)' }} onClick={handleDelete}>
                Delete Space
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function RoomsPage() {
  const [activeTab, setActiveTab] = useState('members');
  const { currentSpace, isLoadingSpaces, spacesError } = useSpace();

  if (isLoadingSpaces) {
    return (
      <div className={styles.container}>
        <div style={{ padding: 'var(--space-8)', textAlign: 'center', color: 'var(--color-text-muted)' }}>
          Loading space data…
        </div>
      </div>
    );
  }

  if (spacesError) {
    return (
      <div className={styles.container}>
        <div style={{ padding: 'var(--space-8)', textAlign: 'center', color: 'var(--color-danger)' }}>
          {spacesError}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Members &amp; Space</h1>
          <p className={styles.subtitle}>
            {currentSpace
              ? `Manage members and settings for "${currentSpace.name}".`
              : 'Select a space from the sidebar to get started.'}
          </p>
        </div>
      </header>

      <Tabs tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />

      <div className={styles.content}>
        {activeTab === 'members' && <MembersTab />}
        {activeTab === 'space' && <SpaceInfoTab />}
      </div>
    </div>
  );
}
