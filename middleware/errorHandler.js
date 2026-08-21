const ApiError = require('../utils/ApiError');

/**
 * Centralised Express error-handling middleware.
 *
 * Must be registered AFTER all routes:
 *   app.use(errorHandler);
 *
 * Handles:
 *  - ApiError instances (custom app errors)
 *  - Mongoose ValidationError
 *  - Mongoose CastError (invalid ObjectId, etc.)
 *  - MongoDB duplicate key error (code 11000)
 *  - Everything else as a generic 500
 */
// eslint-disable-next-line no-unused-vars -- Express requires the 4-param signature
const errorHandler = (err, req, res, _next) => {
  // ---- Defaults ----
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let details = err.details || undefined;

  // ---- Mongoose: ValidationError ----
  if (err.name === 'ValidationError' && err.errors) {
    statusCode = 400;
    message = 'Validation failed';
    details = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
  }

  // ---- Mongoose: CastError (e.g. invalid ObjectId) ----
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid value for ${err.path}: ${err.value}`;
    details = undefined;
  }

  // ---- MongoDB: Duplicate key (code 11000) ----
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyPattern || {})[0] || 'field';
    message = `Duplicate value for '${field}'. That ${field} already exists.`;
    details = undefined;
  }

  // ---- Log in development ----
  if (process.env.NODE_ENV !== 'production') {
    console.error('[ErrorHandler]', err);
  }

  // ---- Build response ----
  const body = {
    success: false,
    message,
  };

  if (details !== undefined) {
    body.details = details;
  }

  // Include stack trace only in development
  if (process.env.NODE_ENV !== 'production') {
    body.stack = err.stack;
  }

  return res.status(statusCode).json(body);
};

module.exports = errorHandler;
