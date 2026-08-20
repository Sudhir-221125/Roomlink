import { useState } from 'react';
import styles from './ChoresPage.module.css';
import Badge from '../../components/common/Badge';
import { useToast } from '../../contexts/ToastContext';

const INITIAL_CHORES = [
  { id: 'c1', title: 'Take out the trash', assignedTo: 'Alice S.', deadline: '2023-10-25', status: 'Today', priority: 'High', recurring: true },
  { id: 'c2', title: 'Clean the kitchen', assignedTo: 'Bob J.', deadline: '2023-10-25', status: 'Today', priority: 'Medium', recurring: true },
  { id: 'c3', title: 'Vacuum common area', assignedTo: 'Charlie D.', deadline: '2023-10-28', status: 'Upcoming', priority: 'Medium', recurring: true },
  { id: 'c4', title: 'Clean windows', assignedTo: 'Alice S.', deadline: '2023-11-05', status: 'Upcoming', priority: 'Low', recurring: false },
  { id: 'c5', title: 'Mop the floors', assignedTo: 'Bob J.', deadline: '2023-10-20', status: 'Completed', priority: 'Medium', recurring: true },
];

export default function ChoresPage() {
  const [chores, setChores] = useState(INITIAL_CHORES);
  const [completingId, setCompletingId] = useState(null);
  const { showToast } = useToast();

  const getPriorityVariant = (priority) => {
    switch (priority) {
      case 'High': return 'danger';
      case 'Medium': return 'warning';
      case 'Low': return 'info';
      default: return 'neutral';
    }
  };

  const handleComplete = (id) => {
    setCompletingId(id);
    setTimeout(() => {
      setChores(chores.map(chore => 
        chore.id === id ? { ...chore, status: 'Completed' } : chore
      ));
      setCompletingId(null);
    }, 400); // Matches transition duration
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
          {columnChores.length > 0 ? (
            columnChores.map(chore => (
              <div 
                key={chore.id} 
                className={`${styles.card} ${completingId === chore.id ? styles.completing : ''}`}
              >
                <div className={styles.cardHeader}>
                  <h3 className={styles.cardTitle}>{chore.title}</h3>
                  <Badge variant={getPriorityVariant(chore.priority)}>{chore.priority}</Badge>
                </div>
                
                <div className={styles.cardBody}>
                  <div className={styles.assignee}>
                    <div className={styles.avatar}>{chore.assignedTo.charAt(0)}</div>
                    <span>{chore.assignedTo}</span>
                  </div>
                  <div className={styles.details}>
                    <span>📅 {chore.deadline}</span>
                    {chore.recurring && <span>🔁 Recurring</span>}
                  </div>
                </div>

                {status !== 'Completed' && (
                  <div className={styles.cardFooter}>
                    <button 
                      className={styles.completeButton}
                      onClick={() => handleComplete(chore.id)}
                    >
                      ✓ Mark Complete
                    </button>
                  </div>
                )}
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

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Chores & Tasks</h1>
          <p className={styles.subtitle}>Track shared responsibilities and cleaning schedules.</p>
        </div>
        <button 
          className={styles.primaryButton}
          onClick={() => showToast('Chore assignment modal coming soon', 'info')}
        >
          + Assign Chore
        </button>
      </header>

      <div className={styles.board}>
        {renderColumn('Today', 'Today')}
        {renderColumn('Upcoming', 'Upcoming')}
        {renderColumn('Completed', 'Completed')}
      </div>
    </div>
  );
}
