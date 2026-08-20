/**
 * DashboardPage.jsx
 * The main "Command Center" dashboard for RoomLink.
 */
import { useState } from 'react';
import NeedsAttention from '../../components/NeedsAttention/NeedsAttention';
import OverviewMetrics from '../../components/OverviewMetrics/OverviewMetrics';
import TodaySchedule from '../../components/TodaySchedule/TodaySchedule';
import QuickActions from '../../components/QuickActions/QuickActions';
import ResidentOverview from '../../components/ResidentOverview/ResidentOverview';
import ActivityFeed from '../../components/ActivityFeed/ActivityFeed';
import UpcomingReminders from '../../components/UpcomingReminders/UpcomingReminders';
import AddReminderModal from '../../components/AddReminderModal/AddReminderModal';

import { useStaggeredReveal } from '../../hooks/useScrollReveal';
import {
  needsAttention,
  recentActivity,
  residents,
  upcomingReminders as initialReminders,
  todaySchedule
} from '../../services/mockData';
import styles from './DashboardPage.module.css';

export default function DashboardPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [reminders, setReminders] = useState(initialReminders);

  // Staggered reveal for top-level layout sections
  const layoutRef = useStaggeredReveal(`.${styles.revealSection}`, { threshold: 0.05 });

  // Current date greeting
  const today = new Date();
  const hour = today.getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const dateString = today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  function handleAddReminder(reminder) {
    setReminders((prev) => [...prev, reminder]);
  }

  return (
    <div className={styles.page} ref={layoutRef}>
      
      {/* ── Top Row: Header & Overview Metrics ── */}
      <div className={`${styles.topRow} ${styles.revealSection}`}>
        <div className={styles.header}>
          <div className={styles.headerContext}>
            <span className={styles.dateLabel}>{dateString}</span>
            <span className={styles.propertyLabel}>The Sunnydale House</span>
          </div>
          <h1 className={styles.greeting}>{greeting}, Alex</h1>
          <p className={styles.greetingSub}>Here is what requires your attention today.</p>
        </div>
        
        <div className={styles.metricsWrapper}>
          <OverviewMetrics />
        </div>
      </div>

      {/* ── Main Asymmetric Layout ── */}
      <div className={styles.mainGrid}>
        
        {/* Left Column: Urgent & Actionable (65%) */}
        <div className={styles.leftCol}>
          <div className={styles.revealSection}>
            <NeedsAttention items={needsAttention} />
          </div>
          
          <div className={styles.revealSection}>
            <TodaySchedule schedule={todaySchedule} />
          </div>
        </div>

        {/* Right Column: Context & Future (35%) */}
        <div className={styles.rightCol}>
          <div className={styles.revealSection}>
            <QuickActions />
          </div>
          
          <div className={styles.revealSection}>
            <ResidentOverview residents={residents} />
          </div>
          
          <div className={styles.revealSection}>
            <UpcomingReminders reminders={reminders} onAddClick={() => setModalOpen(true)} />
          </div>
          
          <div className={styles.revealSection}>
            <ActivityFeed activities={recentActivity} />
          </div>
        </div>
      </div>

      <AddReminderModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onAdd={handleAddReminder}
      />
    </div>
  );
}
