import { useState, useEffect, useCallback } from 'react';
import NeedsAttention from '../../components/NeedsAttention/NeedsAttention';
import OverviewMetrics from '../../components/OverviewMetrics/OverviewMetrics';
import TodaySchedule from '../../components/TodaySchedule/TodaySchedule';
import QuickActions from '../../components/QuickActions/QuickActions';
import ResidentOverview from '../../components/ResidentOverview/ResidentOverview';
import ActivityFeed from '../../components/ActivityFeed/ActivityFeed';
import UpcomingReminders from '../../components/UpcomingReminders/UpcomingReminders';
import AddReminderModal from '../../components/AddReminderModal/AddReminderModal';
import CreateSpaceModal from '../../components/CreateSpaceModal/CreateSpaceModal';

import { useAuth } from '../../contexts/AuthContext';
import { useSpace } from '../../contexts/SpaceContext';
import { useStaggeredReveal } from '../../hooks/useScrollReveal';
import { useToast } from '../../contexts/ToastContext';
import styles from './DashboardPage.module.css';

import { getBills } from '../../services/billService';
import { getPayments } from '../../services/paymentService';
import { getChores } from '../../services/choreService';
import { getComplaints } from '../../services/complaintService';

export default function DashboardPage({ onNavigate }) {
  const { user } = useAuth();
  const { currentSpace, members } = useSpace();
  const { showToast } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [reminders, setReminders] = useState([]);

  // REAL API State for derived metrics
  const [bills, setBills] = useState([]);
  const [payments, setPayments] = useState([]);
  const [chores, setChores] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [isLoadingMetrics, setIsLoadingMetrics] = useState(true);
  const [createSpaceOpen, setCreateSpaceOpen] = useState(false);

  const spaceId = currentSpace?._id || currentSpace?.id;

  const fetchDashboardData = useCallback(async () => {
    if (!spaceId) {
      setBills([]);
      setPayments([]);
      setChores([]);
      setComplaints([]);
      setIsLoadingMetrics(false);
      return;
    }
    
    setIsLoadingMetrics(true);
    try {
      const [fetchedBills, fetchedChores, fetchedComplaints] = await Promise.all([
        getBills(spaceId).catch(() => []),
        getChores(spaceId).catch(() => []),
        getComplaints(spaceId).catch(() => [])
      ]);

      const billsList = Array.isArray(fetchedBills) ? fetchedBills : [];
      setBills(billsList);
      setChores(Array.isArray(fetchedChores) ? fetchedChores : []);
      setComplaints(Array.isArray(fetchedComplaints) ? fetchedComplaints : []);

      // Fetch payments for all bills
      let allPayments = [];
      if (billsList.length > 0) {
        const paymentPromises = billsList.map(b => getPayments(spaceId, b._id).catch(() => []));
        const paymentsLists = await Promise.all(paymentPromises);
        allPayments = paymentsLists.flat().filter(p => p !== undefined && p !== null);
      }
      setPayments(allPayments);

    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setIsLoadingMetrics(false);
    }
  }, [spaceId]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Derived Metrics
  const totalBilled = bills.reduce((sum, b) => sum + (b.amount || 0), 0);
  const totalPaid = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
  const outstandingAmount = Math.max(totalBilled - totalPaid, 0);
  
  // Calculate pending bills count by computing remaining amount per bill
  let pendingBillsCount = 0;
  bills.forEach(bill => {
    const billPayments = payments.filter(p => p.bill_id === bill._id);
    const paidForBill = billPayments.reduce((sum, p) => sum + (p.amount || 0), 0);
    if (bill.amount > paidForBill) {
      pendingBillsCount++;
    }
  });

  const pendingChores = chores.filter(c => c.status === 'pending' || c.status === 'in_progress');
  const openComplaints = complaints.filter(c => c.status === 'open');
  const inProgressComplaints = complaints.filter(c => c.status === 'in_progress');

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
  const membersForOverview = members.slice(0, 5).map(m => {
    const memberUser = m.user_id || m.user || {};
    const name = memberUser.name || 'Unknown';
    return {
      id: m._id || memberUser._id || memberUser.id,
      name,
      role: m.role_in_space || 'member',
      status: 'active',
      avatar: name.charAt(0).toUpperCase(),
      avatarColor: '#6366f1',
    };
  });

  function handleAddReminder(reminder) {
    setReminders((prev) => [...prev, reminder]);
  }

  if (!currentSpace && !isLoadingMetrics) {
    return (
      <div className={styles.page} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
        <div style={{ textAlign: 'center', maxWidth: 400, padding: 'var(--space-8)' }}>
          <div style={{ fontSize: '3rem', marginBottom: 'var(--space-4)' }}>🏢</div>
          <h1 style={{ fontSize: 'var(--text-xl)', fontWeight: 600, marginBottom: 'var(--space-2)' }}>Welcome to RoomLink</h1>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--space-6)', lineHeight: 1.5 }}>
            You don't have a Space yet. Create one to start managing your residence, tracking bills, and collaborating with housemates.
          </p>
          <button 
            className="rl-btn rl-btn-primary" 
            style={{ width: '100%', justifyContent: 'center' }}
            onClick={() => setCreateSpaceOpen(true)}
          >
            Create Space
          </button>
        </div>
        {createSpaceOpen && (
          <CreateSpaceModal
            onClose={() => setCreateSpaceOpen(false)}
            showToast={showToast}
          />
        )}
      </div>
    );
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
          <OverviewMetrics 
            totalBilled={totalBilled}
            totalPaid={totalPaid}
            outstandingAmount={outstandingAmount}
            pendingBillsCount={pendingBillsCount}
            membersCount={members.length}
            openIssuesCount={openComplaints.length}
            inProgressIssuesCount={inProgressComplaints.length}
            isLoading={isLoadingMetrics}
          />
        </div>
      </div>

      {/* ── Main Asymmetric Layout ── */}
      <div className={styles.mainGrid}>

        {/* Left Column: Urgent & Actionable (65%) */}
        <div className={styles.leftCol}>
          <div className={styles.revealSection}>
            <NeedsAttention 
              pendingBillsCount={pendingBillsCount}
              outstandingAmount={outstandingAmount}
              openComplaintsCount={openComplaints.length}
              inProgressComplaintsCount={inProgressComplaints.length}
              pendingChoresCount={pendingChores.length}
              isLoading={isLoadingMetrics}
              onNavigate={onNavigate}
            />
          </div>

          <div className={styles.revealSection}>
            <TodaySchedule schedule={[]} />
          </div>
        </div>

        {/* Right Column: Context & Future (35%) */}
        <div className={styles.rightCol}>
          <div className={styles.revealSection}>
            <QuickActions onNavigate={onNavigate} />
          </div>

          <div className={styles.revealSection}>
            <ResidentOverview residents={membersForOverview.length > 0 ? membersForOverview : undefined} />
          </div>

          <div className={styles.revealSection}>
            <UpcomingReminders reminders={reminders} onAddClick={() => setModalOpen(true)} />
          </div>

          <div className={styles.revealSection}>
            <ActivityFeed activities={[]} />
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
