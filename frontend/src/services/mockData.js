/**
 * mockData.js
 * Static mock data for the RoomLink frontend.
 * Replace with real API calls when the backend is ready.
 */

// ── Helper: format a date N days from today ─────────────────────────────────
function daysFromNow(n) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// ── Dashboard summary cards ─────────────────────────────────────────────────
export const dashboardStats = [
  {
    id: 'total-rent',
    label: 'Total Rent',
    value: '₹18,500',
    sub: 'Due on 1st of month',
    trend: '+2.4%',
    trendUp: false,       // going up means more to pay — mark as neutral/bad
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

// ── Recent activity feed ────────────────────────────────────────────────────
export const recentActivity = [
  {
    id: 'act-1',
    type: 'payment',
    actor: 'Riya Sharma',
    message: 'paid ₹6,200 for July rent',
    time: '2 hours ago',
    avatar: 'RS',
    avatarColor: '#0d9488',
  },
  {
    id: 'act-2',
    type: 'complaint',
    actor: 'Arjun Mehta',
    message: 'raised a complaint: AC not working in Room 3',
    time: '5 hours ago',
    avatar: 'AM',
    avatarColor: '#d97706',
  },
  {
    id: 'act-3',
    type: 'chore',
    actor: 'Priya Nair',
    message: 'marked "Kitchen cleaning" as done',
    time: 'Yesterday, 8:30 PM',
    avatar: 'PN',
    avatarColor: '#16a34a',
  },
  {
    id: 'act-4',
    type: 'guest',
    actor: 'Karan Patel',
    message: 'added a guest check-in for 3 days',
    time: 'Yesterday, 4:00 PM',
    avatar: 'KP',
    avatarColor: '#2563eb',
  },
  {
    id: 'act-5',
    type: 'bill',
    actor: 'System',
    message: 'Electricity bill of ₹1,840 added for this month',
    time: '2 days ago',
    avatar: 'SY',
    avatarColor: '#7c3aed',
  },
  {
    id: 'act-6',
    type: 'payment',
    actor: 'Sneha Iyer',
    message: 'paid ₹6,200 for July rent',
    time: '3 days ago',
    avatar: 'SI',
    avatarColor: '#db2777',
  },
];

// ── Resident quick overview ─────────────────────────────────────────────────
export const residents = [
  { id: 'r1', name: 'Riya Sharma',  room: 'Room 1', status: 'paid',    avatar: 'RS', avatarColor: '#0d9488' },
  { id: 'r2', name: 'Arjun Mehta', room: 'Room 2', status: 'pending',  avatar: 'AM', avatarColor: '#d97706' },
  { id: 'r3', name: 'Priya Nair',  room: 'Room 3', status: 'paid',    avatar: 'PN', avatarColor: '#16a34a' },
  { id: 'r4', name: 'Karan Patel', room: 'Room 4', status: 'overdue', avatar: 'KP', avatarColor: '#dc2626' },
  { id: 'r5', name: 'Sneha Iyer',  room: 'Room 5', status: 'paid',    avatar: 'SI', avatarColor: '#db2777' },
];

// ── Upcoming reminders (dynamic dates relative to today) ────────────────────
export const upcomingReminders = [
  { id: 'rem-1', title: 'Rent Due',     date: daysFromNow(3),  color: 'brand' },
  { id: 'rem-2', title: 'Water Bill',   date: daysFromNow(7),  color: 'warning' },
  { id: 'rem-3', title: 'Deep Clean',   date: daysFromNow(12), color: 'success' },
];

// ── Needs Attention items (derived from existing mock data) ─────────────────
export const needsAttention = [
  {
    id: 'attn-1',
    type: 'overdue',
    title: 'Rent overdue',
    description: 'Karan Patel — Room 4',
    severity: 'danger',
  },
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
    description: '1 in progress — AC not working (Room 3)',
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

// ── Mock notifications ──────────────────────────────────────────────────────
export const mockNotifications = [
  {
    id: 'notif-1',
    title: 'Rent payment received',
    body: 'Riya Sharma paid ₹6,200',
    time: '2 hours ago',
    read: false,
  },
  {
    id: 'notif-2',
    title: 'New complaint filed',
    body: 'AC not working — Room 3',
    time: '5 hours ago',
    read: false,
  },
  {
    id: 'notif-3',
    title: 'Chore completed',
    body: 'Priya Nair finished kitchen cleaning',
    time: 'Yesterday',
    read: true,
  },
  {
    id: 'notif-4',
    title: 'Electricity bill added',
    body: '₹1,840 for this month',
    time: '2 days ago',
    read: true,
  },
];

// ── Searchable items (for frontend search overlay) ──────────────────────────
export const searchableItems = [
  { type: 'resident', label: 'Riya Sharma',  detail: 'Room 1 · Paid',     page: 'rooms' },
  { type: 'resident', label: 'Arjun Mehta',  detail: 'Room 2 · Pending',  page: 'rooms' },
  { type: 'resident', label: 'Priya Nair',   detail: 'Room 3 · Paid',     page: 'rooms' },
  { type: 'resident', label: 'Karan Patel',  detail: 'Room 4 · Overdue',  page: 'rooms' },
  { type: 'resident', label: 'Sneha Iyer',   detail: 'Room 5 · Paid',     page: 'rooms' },
  { type: 'room',     label: 'Room 1',       detail: 'Riya Sharma',       page: 'rooms' },
  { type: 'room',     label: 'Room 2',       detail: 'Arjun Mehta',       page: 'rooms' },
  { type: 'room',     label: 'Room 3',       detail: 'Priya Nair',        page: 'rooms' },
  { type: 'room',     label: 'Room 4',       detail: 'Karan Patel',       page: 'rooms' },
  { type: 'room',     label: 'Room 5',       detail: 'Sneha Iyer',        page: 'rooms' },
  { type: 'page',     label: 'Dashboard',    detail: 'Overview & stats',  page: 'dashboard' },
  { type: 'page',     label: 'Rent & Payments', detail: 'Track rent',     page: 'rent' },
  { type: 'page',     label: 'Bills',        detail: 'Utility bills',     page: 'bills' },
  { type: 'page',     label: 'Chores',       detail: 'Task schedules',    page: 'chores' },
  { type: 'page',     label: 'Complaints',   detail: 'Issue tracking',    page: 'complaints' },
  { type: 'page',     label: 'Guests',       detail: 'Guest management',  page: 'guests' },
  { type: 'page',     label: 'Settings',     detail: 'Configuration',     page: 'settings' },
];

// ── Today's Schedule ────────────────────────────────────────────────────────
export const todaySchedule = [
  { id: 'today-1', time: '10:00 AM', type: 'visitor', title: 'AC Repair Technician', detail: 'Expected for Room 3 AC repair' },
  { id: 'today-2', time: '02:00 PM', type: 'chore', title: 'Trash Collection', detail: 'Assigned to: Arjun Mehta' },
  { id: 'today-3', time: '06:30 PM', type: 'payment', title: 'Rent Follow-up', detail: 'Call Karan Patel regarding overdue rent' },
];

