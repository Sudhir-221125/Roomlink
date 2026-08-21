const express = require('express');
const { protect } = require('../middleware/auth');
const { getDashboard } = require('../controllers/dashboardController');

const router = express.Router();

// All dashboard routes require authentication
router.use(protect);

// GET /api/dashboard — aggregated stats for the authenticated user
router.get('/', getDashboard);

module.exports = router;
