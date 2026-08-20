import styles from './EmptyState.module.css';

export default function EmptyState({ icon, title, description, action }) {
  return (
    <div className={styles.emptyState}>
      {icon && <div className={styles.iconWrapper}>{icon}</div>}
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
      {action && <div className={styles.actionWrapper}>{action}</div>}
    </div>
  );
}
