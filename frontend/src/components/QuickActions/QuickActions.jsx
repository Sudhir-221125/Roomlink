import styles from './QuickActions.module.css';
import { useToast } from '../../contexts/ToastContext';

const actions = [
  { id: 'add-res', label: 'Add Resident', icon: '👤' },
  { id: 'add-room', label: 'Add Room', icon: '🚪' },
  { id: 'rec-pay', label: 'Record Payment', icon: '💸' },
  { id: 'add-chore', label: 'Create Chore', icon: '🧹' },
  { id: 'add-rem', label: 'Add Reminder', icon: '📅' },
  { id: 'rep-iss', label: 'Report Issue', icon: '⚠️' },
];

export default function QuickActions() {
  const { showToast } = useToast();
  return (
    <section className={styles.section} aria-label="Quick Actions">
      <h2 className={styles.title}>Quick Actions</h2>
      <div className={styles.grid}>
        {actions.map(action => (
          <button 
            key={action.id} 
            className={styles.actionBtn}
            onClick={() => showToast(`Action "${action.label}" coming soon`, 'info')}
          >
            <span className={styles.icon}>{action.icon}</span>
            <span className={styles.label}>{action.label}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
