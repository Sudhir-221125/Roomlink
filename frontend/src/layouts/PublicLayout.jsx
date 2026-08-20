/**
 * PublicLayout.jsx
 * Root shell layout for the unauthenticated public landing experience.
 */
import PublicNav from '../components/PublicNav/PublicNav';
import PublicFooter from '../components/PublicFooter/PublicFooter';
import styles from './PublicLayout.module.css';

export default function PublicLayout({ onLogin, children }) {
  return (
    <div className={styles.layout}>
      <PublicNav onLogin={onLogin} />
      <main className={styles.main}>
        {children}
      </main>
      <PublicFooter />
    </div>
  );
}
