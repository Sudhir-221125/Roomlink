/**
 * Standardised API response helpers.
 *
 * Every successful response follows the shape:
 *   { success: true, message: "...", data: ... }
 */

/**
 * Send a success response.
 *
 * @param {import('express').Response} res
 * @param {number}  statusCode - HTTP status (200, 201, etc.).
 * @param {string}  message    - Human-readable success message.
 * @param {*}       [data]     - Optional response payload.
 */
const sendSuccess = (res, statusCode, message, data = undefined) => {
  const body = { success: true, message };
  if (data !== undefined) {
    body.data = data;
  }
  return res.status(statusCode).json(body);
};

/**
 * Convenience: 200 OK.
 */
const ok = (res, message, data) => sendSuccess(res, 200, message, data);

/**
 * Convenience: 201 Created.
 */
const created = (res, message, data) => sendSuccess(res, 201, message, data);

module.exports = { sendSuccess, ok, created };
