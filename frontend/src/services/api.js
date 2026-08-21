/**
 * api.js
 * Centralized HTTP client for RoomLink.
 *
 * - Reads VITE_API_BASE_URL from environment (never hardcoded)
 * - Attaches Authorization: Bearer <token> on authenticated requests
 * - Parses the backend's standard { success, message, data } envelope
 * - Throws structured ApiError objects for all error responses
 * - Handles 401 by clearing stored auth and signalling session expiry
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

// ── Storage helpers ──────────────────────────────────────────────────────────

export function getStoredToken() {
  return localStorage.getItem('rl_token');
}

export function setStoredToken(token) {
  if (token) {
    localStorage.setItem('rl_token', token);
  } else {
    localStorage.removeItem('rl_token');
  }
}

// ── Structured error class ───────────────────────────────────────────────────

export class ApiError extends Error {
  constructor(status, message, details = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

// ── Error status → user-friendly message map ─────────────────────────────────

function friendlyMessage(status, serverMessage) {
  if (serverMessage) return serverMessage;
  switch (status) {
    case 400: return 'Invalid request. Please check your input.';
    case 401: return 'Your session has expired. Please sign in again.';
    case 403: return 'You do not have permission to perform this action.';
    case 404: return 'The requested resource was not found.';
    case 409: return 'A conflict occurred. This resource may already exist.';
    case 500: return 'A server error occurred. Please try again later.';
    default:  return 'An unexpected error occurred.';
  }
}

// ── Core fetch wrapper ───────────────────────────────────────────────────────

/**
 * Makes an authenticated API request.
 *
 * @param {string} path   - Path relative to BASE_URL (e.g. '/auth/me')
 * @param {object} options - fetch options (method, body, etc.)
 * @param {boolean} requiresAuth - Whether to attach the JWT (default: true)
 * @returns {Promise<any>} - Resolves with response.data
 * @throws {ApiError}
 */
export async function request(path, options = {}, requiresAuth = true) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (requiresAuth) {
    const token = getStoredToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  let response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers,
    });
  } catch (networkError) {
    // Network failure (server down, CORS, etc.)
    throw new ApiError(0, 'Cannot reach the server. Is the backend running?');
  }

  // Parse JSON body regardless of status code
  let body = null;
  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    try {
      body = await response.json();
    } catch {
      body = null;
    }
  }

  // Handle 401 — session expired
  if (response.status === 401) {
    setStoredToken(null); // Clear invalid token
    // Dispatch a custom event so AuthContext can react
    window.dispatchEvent(new CustomEvent('rl:unauthorized'));
    throw new ApiError(
      401,
      friendlyMessage(401, body?.message),
      body?.details
    );
  }

  // Handle other error status codes
  if (!response.ok) {
    throw new ApiError(
      response.status,
      friendlyMessage(response.status, body?.message),
      body?.details
    );
  }

  // Success — return the data payload (or full body if no envelope)
  return body?.data !== undefined ? body.data : body;
}

// ── Convenience methods ───────────────────────────────────────────────────────

export const api = {
  get:    (path, opts, auth)        => request(path, { ...opts, method: 'GET' }, auth),
  post:   (path, body, opts, auth)  => request(path, { ...opts, method: 'POST',  body: JSON.stringify(body) }, auth),
  patch:  (path, body, opts, auth)  => request(path, { ...opts, method: 'PATCH', body: JSON.stringify(body) }, auth),
  delete: (path, opts, auth)        => request(path, { ...opts, method: 'DELETE' }, auth),
};

export default api;
