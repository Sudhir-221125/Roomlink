/**
 * Custom API error class.
 * Extends the native Error to carry an HTTP status code and
 * an optional details payload for structured error responses.
 */
class ApiError extends Error {
  /**
   * @param {number} statusCode - HTTP status code (e.g. 400, 404, 500).
   * @param {string} message    - Human-readable error message.
   * @param {*}      [details]  - Optional additional error details (validation errors, etc.).
   */
  constructor(statusCode, message, details = undefined) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.details = details;

    // Capture a clean stack trace, excluding the constructor frame
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ApiError;
