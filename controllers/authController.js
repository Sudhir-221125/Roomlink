const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { created, ok } = require('../utils/apiResponse');

const BCRYPT_SALT_ROUNDS = 12;

/**
 * Generate a signed JWT for the given user.
 *
 * @param {Object} user - Mongoose user document.
 * @returns {string} Signed JWT.
 */
const generateToken = (user) => {
  return jwt.sign(
    {
      userId: user._id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

/**
 * Strip sensitive fields and return a clean user object for API responses.
 *
 * @param {Object} user - Mongoose user document.
 * @returns {Object} Sanitised user object.
 */
const sanitiseUser = (user) => {
  const obj = user.toObject();
  delete obj.password_hash;
  return obj;
};

// ─────────────────────────────────────────────
// POST /api/auth/register
// ─────────────────────────────────────────────
const register = catchAsync(async (req, res) => {
  const { name, email, phone, password, role } = req.body;

  // 1. Validate required fields
  if (!name || !email || !password) {
    throw new ApiError(400, 'Name, email, and password are required.');
  }

  // 2. Validate password length
  if (password.length < 6) {
    throw new ApiError(400, 'Password must be at least 6 characters long.');
  }

  // 3. Validate role — only 'resident' and 'guest' are self-assignable during signup
  const SELF_ASSIGNABLE_ROLES = ['resident', 'guest'];
  const userRole = role || 'resident';
  if (!SELF_ASSIGNABLE_ROLES.includes(userRole)) {
    throw new ApiError(400, `Role must be one of: ${SELF_ASSIGNABLE_ROLES.join(', ')}. Cannot self-assign '${role}'.`);
  }

  // 4. Hash password
  const password_hash = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);

  // 5. Create user (duplicate email → MongoDB 11000 → errorHandler handles it)
  const user = await User.create({
    name,
    email,
    phone: phone || undefined,
    password_hash,
    role: userRole,
  });

  // 6. Generate token
  const token = generateToken(user);

  // 7. Respond
  return created(res, 'User registered successfully.', {
    user: sanitiseUser(user),
    token,
  });
});

// ─────────────────────────────────────────────
// POST /api/auth/login
// ─────────────────────────────────────────────
const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  // 1. Validate input
  if (!email || !password) {
    throw new ApiError(400, 'Email and password are required.');
  }

  // 2. Find user by email (explicitly include password_hash for comparison)
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(401, 'Invalid email or password.');
  }

  // 3. Compare password
  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) {
    throw new ApiError(401, 'Invalid email or password.');
  }

  // 4. Generate token
  const token = generateToken(user);

  // 5. Respond
  return ok(res, 'Login successful.', {
    user: sanitiseUser(user),
    token,
  });
});

// ─────────────────────────────────────────────
// GET /api/auth/me
// ─────────────────────────────────────────────
const getMe = catchAsync(async (req, res) => {
  // req.user is set by the protect middleware (already excludes password_hash)
  return ok(res, 'User profile retrieved.', { user: req.user });
});

// ─────────────────────────────────────────────
// PATCH /api/auth/me
// ─────────────────────────────────────────────
const updateMe = catchAsync(async (req, res) => {
  const { name, phone, password } = req.body;

  // Fetch the full user so we can save (req.user excludes password_hash)
  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(404, 'User not found.');
  }

  // Only allow safe fields — never email or role via this endpoint
  if (name !== undefined) {
    if (!name.trim()) {
      throw new ApiError(400, 'Name cannot be empty.');
    }
    user.name = name.trim();
  }

  if (phone !== undefined) {
    user.phone = phone || undefined;
  }

  if (password !== undefined) {
    if (password.length < 6) {
      throw new ApiError(400, 'Password must be at least 6 characters long.');
    }
    user.password_hash = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
  }

  await user.save();

  return ok(res, 'Profile updated successfully.', { user: sanitiseUser(user) });
});

module.exports = { register, login, getMe, updateMe };
