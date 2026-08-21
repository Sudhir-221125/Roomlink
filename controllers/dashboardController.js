const Membership = require('../models/Membership');
const Bill = require('../models/Bill');
const Payment = require('../models/Payment');
const Chore = require('../models/Chore');
const Complaint = require('../models/Complaint');
const Notification = require('../models/Notification');
const Guest = require('../models/Guest');
const catchAsync = require('../utils/catchAsync');
const { ok } = require('../utils/apiResponse');

// ─────────────────────────────────────────────
// GET /api/dashboard
// ─────────────────────────────────────────────
const getDashboard = catchAsync(async (req, res) => {
  const userId = req.user._id;

  // 1. Find all spaces the user belongs to
  const memberships = await Membership.find({
    user_id: userId,
    is_active: true,
  });

  const spaceIds = memberships.map((m) => m.space_id);
  const totalSpaces = spaceIds.length;

  if (totalSpaces === 0) {
    return ok(res, 'Dashboard data retrieved.', {
      totalSpaces: 0,
      totalMembers: 0,
      totalGuests: 0,
      pendingBills: 0,
      totalBillAmount: 0,
      totalPayments: 0,
      openComplaints: 0,
      totalChores: 0,
      pendingChores: 0,
      completedChores: 0,
      unreadNotifications: 0,
      recentActivity: [],
    });
  }

  // 2. Aggregate counts from existing models — all scoped to user's spaces
  const [
    totalMembers,
    totalGuests,
    bills,
    openComplaints,
    totalChores,
    pendingChores,
    completedChores,
    unreadNotifications,
  ] = await Promise.all([
    Membership.countDocuments({ space_id: { $in: spaceIds }, is_active: true }),
    Guest.countDocuments({ space_id: { $in: spaceIds } }),
    Bill.find({ space_id: { $in: spaceIds } }).select('_id amount'),
    Complaint.countDocuments({
      space_id: { $in: spaceIds },
      status: { $in: ['open', 'in_progress'] },
    }),
    Chore.countDocuments({ space_id: { $in: spaceIds } }),
    Chore.countDocuments({
      space_id: { $in: spaceIds },
      status: { $in: ['pending', 'in_progress'] },
    }),
    Chore.countDocuments({
      space_id: { $in: spaceIds },
      status: 'done',
    }),
    Notification.countDocuments({ user_id: userId, is_read: false }),
  ]);

  const pendingBills = bills.length;
  const totalBillAmount = bills.reduce((sum, b) => sum + (b.amount || 0), 0);

  // 3. Sum of payments across all bills in user's spaces
  const billIds = bills.map((b) => b._id);
  let totalPayments = 0;
  if (billIds.length > 0) {
    const paymentAgg = await Payment.aggregate([
      { $match: { bill_id: { $in: billIds } } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    totalPayments = paymentAgg.length > 0 ? paymentAgg[0].total : 0;
  }

  // 4. Recent activity — last 10 items across bills, chores, complaints
  const [recentBills, recentChores, recentComplaints] = await Promise.all([
    Bill.find({ space_id: { $in: spaceIds } })
      .sort({ created_at: -1 })
      .limit(5)
      .populate('created_by', 'name')
      .lean(),
    Chore.find({ space_id: { $in: spaceIds } })
      .sort({ created_at: -1 })
      .limit(5)
      .populate('created_by', 'name')
      .lean(),
    Complaint.find({ space_id: { $in: spaceIds } })
      .sort({ created_at: -1 })
      .limit(5)
      .populate('raised_by', 'name')
      .lean(),
  ]);

  // Merge, tag, sort, and take top 10
  const activity = [
    ...recentBills.map((b) => ({
      type: 'bill',
      title: b.title,
      actor: b.created_by?.name || 'Unknown',
      date: b.created_at,
    })),
    ...recentChores.map((c) => ({
      type: 'chore',
      title: c.title,
      actor: c.created_by?.name || 'Unknown',
      date: c.created_at,
    })),
    ...recentComplaints.map((c) => ({
      type: 'complaint',
      title: c.title,
      actor: c.raised_by?.name || 'Unknown',
      date: c.created_at,
    })),
  ]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 10);

  return ok(res, 'Dashboard data retrieved.', {
    totalSpaces,
    totalMembers,
    totalGuests,
    pendingBills,
    totalBillAmount,
    totalPayments,
    openComplaints,
    totalChores,
    pendingChores,
    completedChores,
    unreadNotifications,
    recentActivity: activity,
  });
});

module.exports = { getDashboard };
