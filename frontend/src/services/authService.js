/**
 * authService.js
 * Wraps the RoomLink Authentication API.
 *
 * Real endpoints (POST /api/auth/register, POST /api/auth/login, GET /api/auth/me)
 * are implemented on the backend. All other auth-related concepts (Google OAuth,
 * email verification, password reset via email) are UI-only placeholders until
 * the backend implements them.
 */
import api, { setStoredToken } from './api.js';

/**
 * Register a new user.
 * POST /api/auth/register
 * Body: { name, email, password }
 * Returns: { user, token }
 */
export async function register({ name, email, password, role }) {
  const data = await api.post('/auth/register', { name, email, password, role }, {}, false);
  if (data.token) {
    setStoredToken(data.token);
  }
  return data; // { user, token }
}

/**
 * Sign in an existing user.
 * POST /api/auth/login
 * Body: { email, password }
 * Returns: { user, token }
 */
export async function login({ email, password }) {
  const data = await api.post('/auth/login', { email, password }, {}, false);
  if (data.token) {
    setStoredToken(data.token);
  }
  return data; // { user, token }
}

/**
 * Restore the current authenticated session.
 * GET /api/auth/me
 * Requires: Authorization: Bearer <token>
 * Returns: { user }
 */
export async function getMe() {
  return api.get('/auth/me');
}

/**
 * Sign out — clears the stored token locally.
 * There is no backend logout endpoint currently.
 */
export function logout() {
  setStoredToken(null);
}
