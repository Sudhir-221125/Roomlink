/**
 * ResidentOverview.jsx
 * Quick-glance list of space members.
 *
 * Accepts residents[] prop with shape:
 *   { id, name, role, status, avatar, avatarColor }
 *
 * 'role' is the Membership.role_in_space (owner/admin/member).
 * 'status' reflects payment status — mock until Payment API exists.
 */
import { useState } from 'react';
import styles from './ResidentOverview.module.css';
import { useToast } from '../../contexts/ToastContext';

const STATUS_CONFIG = {
  paid:    { label: 'Paid',    className: 'statusPaid' },
  pending: { label: 'Pending', className: 'statusPending' },
  overdue: { label: 'Overdue', className: 'statusOverdue' },
  active:  { label: 'Active',  className: 'statusPaid' }, // Used for real members
};

export default function ResidentOverview({ residents = [] }) {
  const [search, setSearch] = useState('');
  const { showToast } = useToast();

  const filtered = residents.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    (r.role || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className={styles.section} aria-label="Resident overview">
      <div className={styles.header}>
        <h2 className={styles.title}>Members</h2>
        <span className={styles.count}>{residents.length} total</span>
      </div>

      <div className={styles.searchWrap}>
        <span className={styles.searchIcon} aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </span>
        <input
          type="search"
          className={styles.searchInput}
          placeholder="Search members..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <ul className={styles.list} role="list">
        {filtered.length === 0 ? (
          <li className={styles.emptyState}>No residents found.</li>
        ) : (
          filtered.map((r) => {
            const status = STATUS_CONFIG[r.status] || STATUS_CONFIG.pending;
            return (
              <li key={r.id} className={styles.item}>
                <div
                  className={styles.avatar}
                  style={{ background: r.avatarColor }}
                  aria-hidden="true"
                >
                  {r.avatar}
                </div>
                <div className={styles.info}>
                  <p className={styles.name}>{r.name}</p>
                  <p className={styles.room} style={{ textTransform: 'capitalize' }}>{r.role || 'member'}</p>
                </div>
                <span className={`${styles.status} ${styles[status.className]}`}>
                  {status.label}
                </span>
              </li>
            );
          })
        )}
      </ul>
      <div className={styles.footer}>
        <button className={styles.toggleBtn} onClick={() => showToast('Full resident directory coming soon', 'info')}>View Directory &rarr;</button>
      </div>
    </section>
  );
}
