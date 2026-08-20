/**
 * DashboardPage.jsx
 * The main "Command Center" dashboard for RoomLink.
 *
 * Space/user-aware:
 *   - Greeting uses the real user's name from AuthContext
 *   - Property label uses the current space name from SpaceContext
 *   - Member count comes from SpaceContext.members
 *
 * Data sources:
 *   - User / Space / Members → REAL API (via AuthContext + SpaceContext)
 *   - Bills / Chores / Complaints / Activity → MOCK DATA (APIs not yet implemented)
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

import { useAuth } from '../../contexts/AuthContext';
import { useSpace } from '../../contexts/SpaceContext';
import { useStaggeredReveal } from '../../hooks/useScrollReveal';
import {
  needsAttention,
  recentActivity,
  upcomingReminders as initialReminders,
  todaySchedule,
} from '../../services/mockData';
import styles from './DashboardPage.module.css';

export default function DashboardPage() {
  const { user } = useAuth();
  const { currentSpace, members } = useSpace();
  const [modalOpen, setModalOpen] = useState(false);
  const [reminders, setReminders] = useState(initialReminders);

  // Staggered reveal for top-level layout sections
  const layoutRef = useStaggeredReveal(`.${styles.revealSection}`, { threshold: 0.05 });

  // Current date greeting
  const today = new Date();
  const hour = today.getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const dateString = today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  // Use real user's first name; fall back to "there" if not loaded
  const firstName = user?.name?.split(' ')[0] || 'there';

  // Use real space name; fall back if no space selected
  const spaceName = currentSpace?.name || 'Your Space';

  // Build resident overview from real members (REAL API)
  // Map Membership objects to the shape ResidentOverview expects
  const membersForOverview = members.slice(0, 5).map(m => {
    const memberUser = m.user_id || m.user || {};
    const name = memberUser.name || 'Unknown';
    return {
      id: m._id || memberUser._id || memberUser.id,
      name,
      role: m.role_in_space || 'member',
      status: 'active', // MOCK — Payment status not yet available from API
      avatar: name.charAt(0).toUpperCase(),
      avatarColor: '#6366f1',
    };
  });

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
            <span className={styles.propertyLabel}>{spaceName}</span>
          </div>
          <h1 className={styles.greeting}>{greeting}, {firstName}</h1>
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
            {/* MOCK DATA — Bills/Chores/Complaints APIs not yet implemented */}
            <NeedsAttention items={needsAttention} />
          </div>

          <div className={styles.revealSection}>
            {/* MOCK DATA — Schedule derived from mock chores/visitors */}
            <TodaySchedule schedule={todaySchedule} />
          </div>
        </div>

        {/* Right Column: Context & Future (35%) */}
        <div className={styles.rightCol}>
          <div className={styles.revealSection}>
            <QuickActions />
          </div>

          <div className={styles.revealSection}>
            {/*
              Members shown here are REAL (from SpaceContext).
              "Status" (paid/pending) is MOCK until Payment API exists.
            */}
            <ResidentOverview residents={membersForOverview.length > 0 ? membersForOverview : undefined} />
          </div>

          <div className={styles.revealSection}>
            {/* MOCK DATA — Reminders stored locally (no API yet) */}
            <UpcomingReminders reminders={reminders} onAddClick={() => setModalOpen(true)} />
          </div>

          <div className={styles.revealSection}>
            {/* MOCK DATA — Activity feed (no API yet) */}
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
