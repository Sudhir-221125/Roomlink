/**
 * mockData.js
 * Static mock data for the RoomLink frontend.
 * Replace with real API calls when the backend is ready.
 */

// ── Dashboard summary cards ─────────────────────────────────────────────────
export const dashboardStats = [
  {
    id: 'total-rent',
    label: 'Total Rent',
    value: '₹18,500',
    sub: 'Due on 1st Aug',
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
    avatarColor: '#6366f1',
  },
  {
    id: 'act-2',
    type: 'complaint',
    actor: 'Arjun Mehta',
    message: 'raised a complaint: AC not working in Room 3',
    time: '5 hours ago',
    avatar: 'AM',
    avatarColor: '#f59e0b',
  },
  {
    id: 'act-3',
    type: 'chore',
    actor: 'Priya Nair',
    message: 'marked "Kitchen cleaning" as done',
    time: 'Yesterday, 8:30 PM',
    avatar: 'PN',
    avatarColor: '#10b981',
  },
  {
    id: 'act-4',
    type: 'guest',
    actor: 'Karan Patel',
    message: 'added a guest check-in for 19 Aug – 21 Aug',
    time: 'Yesterday, 4:00 PM',
    avatar: 'KP',
    avatarColor: '#3b82f6',
  },
  {
    id: 'act-5',
    type: 'bill',
    actor: 'System',
    message: 'Electricity bill of ₹1,840 added for August',
    time: '2 days ago',
    avatar: 'SY',
    avatarColor: '#8b5cf6',
  },
  {
    id: 'act-6',
    type: 'payment',
    actor: 'Sneha Iyer',
    message: 'paid ₹6,200 for July rent',
    time: '3 days ago',
    avatar: 'SI',
    avatarColor: '#ec4899',
  },
];

// ── Resident quick overview ─────────────────────────────────────────────────
export const residents = [
  { id: 'r1', name: 'Riya Sharma',  room: 'Room 1', status: 'paid',    avatar: 'RS', avatarColor: '#6366f1' },
  { id: 'r2', name: 'Arjun Mehta', room: 'Room 2', status: 'pending',  avatar: 'AM', avatarColor: '#f59e0b' },
  { id: 'r3', name: 'Priya Nair',  room: 'Room 3', status: 'paid',    avatar: 'PN', avatarColor: '#10b981' },
  { id: 'r4', name: 'Karan Patel', room: 'Room 4', status: 'overdue', avatar: 'KP', avatarColor: '#ef4444' },
  { id: 'r5', name: 'Sneha Iyer',  room: 'Room 5', status: 'paid',    avatar: 'SI', avatarColor: '#ec4899' },
];

// ── Upcoming reminders ──────────────────────────────────────────────────────
export const upcomingReminders = [
  { id: 'rem-1', title: 'Rent Due', date: 'Aug 1, 2026',  color: 'brand' },
  { id: 'rem-2', title: 'Water Bill', date: 'Aug 5, 2026',  color: 'warning' },
  { id: 'rem-3', title: 'Deep Clean', date: 'Aug 10, 2026', color: 'success' },
];
