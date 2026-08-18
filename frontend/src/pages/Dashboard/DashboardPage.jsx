/**
 * DashboardPage.jsx
 * The main dashboard landing page for RoomLink.
 * Composes all dashboard widgets using mock data.
 */
import StatCard from '../../components/StatCard/StatCard';
import ActivityFeed from '../../components/ActivityFeed/ActivityFeed';
import ResidentOverview from '../../components/ResidentOverview/ResidentOverview';
import UpcomingReminders from '../../components/UpcomingReminders/UpcomingReminders';
import {
  dashboardStats,
  recentActivity,
  residents,
  upcomingReminders,
} from '../../services/mockData';
import styles from './DashboardPage.module.css';

export default function DashboardPage() {
  // Current date greeting
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className={styles.page}>
      {/* ── Page greeting ── */}
      <div className={styles.greetingRow}>
        <div>
          <h1 className={styles.greeting}>{greeting}, Admin 👋</h1>
          <p className={styles.greetingSub}>
            Here&apos;s what&apos;s happening across your property today.
          </p>
        </div>

        {/* Quick action */}
        <button className={styles.actionBtn} id="add-reminder-btn">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
            width="15" height="15" aria-hidden="true">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Reminder
        </button>
      </div>

      {/* ── KPI cards row ── */}
      <section aria-label="Key metrics">
        <div className={styles.statsGrid}>
          {dashboardStats.map((stat) => (
            <StatCard key={stat.id} {...stat} />
          ))}
        </div>
      </section>

      {/* ── Main content grid ── */}
      <div className={styles.mainGrid}>
        {/* Activity feed — takes 2/3 width on large screens */}
        <div className={styles.activityCol}>
          <ActivityFeed activities={recentActivity} />
        </div>

        {/* Right panel — 1/3 width */}
        <div className={styles.sideCol}>
          <ResidentOverview residents={residents} />
          <UpcomingReminders reminders={upcomingReminders} />
        </div>
      </div>
    </div>
  );
}
