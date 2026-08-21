/**
 * mockData.js
 * Static mock data for the RoomLink frontend.
 *
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │  DATA SOURCE LEGEND                                                      │
 * │                                                                          │
 * │  ✅ REAL API  — Auth, Spaces, Memberships (via AuthContext/SpaceContext) │
 * │  🟡 MOCK DATA — Bills, Payments, Chores, Complaints, Notifications      │
 * │               (APIs not yet implemented — replace when ready)            │
 * └─────────────────────────────────────────────────────────────────────────┘
 *
 * When the backend implements the remaining APIs, search for "MOCK DATA" and
 * replace each section with the corresponding service call.
 */

// ── Helper: format a date N days from today ──────────────────────────────────
function daysFromNow(n) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// ── 🟡 MOCK DATA: Dashboard summary cards ────────────────────────────────────
// TODO: Replace with aggregated data from Bill/Chore/Complaint APIs
export const dashboardStats = [
  {
    id: 'total-rent',
    label: 'Total Bills',
    value: '₹18,500',
    sub: 'Due this month',
    trend: '+2.4%',
    trendUp: false,
    icon: 'rent',
    color: 'brand',
  },
  {
    id: 'pending-bills',
    label: 'Pending Bills',
    value: '₹3,240',
    sub: '3 bills unpaid',
    trend: '-1 from last month',
    trendUp: true,
    icon: 'bills',
    color: 'warning',
  },
  {
    id: 'pending-chores',
    label: 'Pending Chores',
    value: '5',
    sub: '2 overdue',
    trend: '+2 this week',
    trendUp: false,
    icon: 'chores',
    color: 'danger',
  },
  {
    id: 'open-complaints',
    label: 'Open Complaints',
    value: '2',
    sub: '1 in progress',
    trend: '-1 resolved',
    trendUp: true,
    icon: 'complaints',
    color: 'info',
  },
];

// ── 🟡 MOCK DATA: Recent activity feed ───────────────────────────────────────
// TODO: Replace with real activity/notification API when available
export const recentActivity = [
  {
    id: 'act-1',
    type: 'payment',
    actor: 'Member A',
    message: 'paid a bill for this month',
    time: '2 hours ago',
    avatar: 'MA',
    avatarColor: '#0d9488',
  },
  {
    id: 'act-2',
    type: 'complaint',
    actor: 'Member B',
    message: 'raised a new complaint',
    time: '5 hours ago',
    avatar: 'MB',
    avatarColor: '#d97706',
  },
  {
    id: 'act-3',
    type: 'chore',
    actor: 'Member C',
    message: 'marked a chore as done',
    time: 'Yesterday, 8:30 PM',
    avatar: 'MC',
    avatarColor: '#16a34a',
  },
  {
    id: 'act-5',
    type: 'bill',
    actor: 'System',
    message: 'A new bill was added for this month',
    time: '2 days ago',
    avatar: 'SY',
    avatarColor: '#7c3aed',
  },
];

// ── 🟡 MOCK DATA: Resident overview (fallback when no real members loaded) ───
// This is used ONLY as a fallback. DashboardPage prioritizes real members
// from SpaceContext. Remove this when member data is always available.
export const residents = [
  { id: 'r1', name: 'Member One',   role: 'owner',  status: 'active',  avatar: 'M1', avatarColor: '#0d9488' },
  { id: 'r2', name: 'Member Two',   role: 'admin',  status: 'active',  avatar: 'M2', avatarColor: '#d97706' },
  { id: 'r3', name: 'Member Three', role: 'member', status: 'active',  avatar: 'M3', avatarColor: '#16a34a' },
];

// ── 🟡 MOCK DATA: Upcoming reminders ────────────────────────────────────────
// TODO: Persist reminders via a future Notification/Reminder API
export const upcomingReminders = [
  { id: 'rem-1', title: 'Rent Due',     date: daysFromNow(3),  color: 'brand' },
  { id: 'rem-2', title: 'Water Bill',   date: daysFromNow(7),  color: 'warning' },
  { id: 'rem-3', title: 'Deep Clean',   date: daysFromNow(12), color: 'success' },
];

// ── 🟡 MOCK DATA: Needs Attention items ─────────────────────────────────────
// TODO: Replace with aggregated data from Bill/Chore/Complaint APIs
export const needsAttention = [
  {
    id: 'attn-2',
    type: 'bills',
    title: '3 bills unpaid',
    description: '₹3,240 pending across electricity, water, internet',
    severity: 'warning',
  },
  {
    id: 'attn-3',
    type: 'complaint',
    title: '2 open complaints',
    description: '1 in progress',
    severity: 'danger',
  },
  {
    id: 'attn-4',
    type: 'chores',
    title: '2 chores overdue',
    description: 'Bathroom cleaning, trash disposal',
    severity: 'warning',
  },
];



// ── 🟡 MOCK DATA: Searchable items ───────────────────────────────────────────
// Room-type entries removed (no Room model in DB).
// Member entries are mock — TODO: replace with real member search from SpaceContext.
export const searchableItems = [
  { type: 'page', label: 'Dashboard',   detail: 'Overview & stats',  page: 'overview' },
  { type: 'page', label: 'Members',     detail: 'Space members',      page: 'members' },
  { type: 'page', label: 'Payments',    detail: 'Track payments',     page: 'rent' },
  { type: 'page', label: 'Bills',       detail: 'Utility bills',      page: 'bills' },
  { type: 'page', label: 'Chores',      detail: 'Task schedules',     page: 'chores' },
  { type: 'page', label: 'Complaints',  detail: 'Issue tracking',     page: 'complaints' },
  { type: 'page', label: 'Guests',      detail: 'Guest management',   page: 'guests' },
  { type: 'page', label: 'Settings',    detail: 'Configuration',      page: 'settings' },
];

// ── 🟡 MOCK DATA: Today's Schedule ───────────────────────────────────────────
// TODO: Replace with real Chore/Complaint API when available
export const todaySchedule = [
  { id: 'today-1', time: '10:00 AM', type: 'visitor', title: 'Maintenance Technician', detail: 'Expected for repair work' },
  { id: 'today-2', time: '02:00 PM', type: 'chore',   title: 'Trash Collection',       detail: 'Assigned to a member' },
  { id: 'today-3', time: '06:30 PM', type: 'payment', title: 'Bill Follow-up',          detail: 'Check on pending payments' },
];
