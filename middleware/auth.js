const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');

/**
 * Protect routes — verify JWT and attach user to req.
 *
 * Expects: Authorization: Bearer <token>
 * Sets:    req.user (Mongoose document, without password_hash)
 */
const protect = catchAsync(async (req, res, next) => {
  // 1. Extract token from Authorization header
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    throw new ApiError(401, 'Not authenticated. Please log in.');
  }

  // 2. Verify token
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      throw new ApiError(401, 'Token has expired. Please log in again.');
    }
    throw new ApiError(401, 'Invalid token. Please log in again.');
  }

  // 3. Check if user still exists
  const user = await User.findById(decoded.userId).select('-password_hash');
  if (!user) {
    throw new ApiError(401, 'The user belonging to this token no longer exists.');
  }

  // 4. Attach user to request
  req.user = user;
  next();
});

/**
 * Restrict access to specific roles.
 *
 * Usage: authorize('admin')  or  authorize('admin', 'member')
 *
 * Must be used AFTER protect middleware.
 *
 * @param  {...string} roles - Allowed roles.
 * @returns {Function} Express middleware.
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      throw new ApiError(401, 'Not authenticated. Please log in.');
    }

    if (!roles.includes(req.user.role)) {
      throw new ApiError(
        403,
        'You do not have permission to perform this action.'
      );
    }

    next();
  };
};

module.exports = { protect, authorize };
