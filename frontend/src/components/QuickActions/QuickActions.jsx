import styles from './QuickActions.module.css';

const actions = [
  { id: 'add-res', label: 'Add Member', icon: '👤', target: 'members' },
  { id: 'create-bill', label: 'Create Bill', icon: '📄', target: 'bills' },
  { id: 'rec-pay', label: 'Record Payment', icon: '💸', target: 'rent' },
  { id: 'add-chore', label: 'Create Chore', icon: '🧹', target: 'chores' },
  { id: 'rep-iss', label: 'Report Issue', icon: '⚠️', target: 'complaints' },
  { id: 'settings', label: 'Space Settings', icon: '⚙️', target: 'settings' },
];

export default function QuickActions({ onNavigate }) {
  return (
    <section className={styles.section} aria-label="Quick Actions">
      <h2 className={styles.title}>Quick Actions</h2>
      <div className={styles.grid}>
        {actions.map(action => (
          <button 
            key={action.id} 
            className={styles.actionBtn}
            onClick={() => onNavigate && onNavigate(action.target)}
          >
            <span className={styles.icon}>{action.icon}</span>
            <span className={styles.label}>{action.label}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
