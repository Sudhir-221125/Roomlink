/**
 * Wraps an async Express route/controller function so that
 * any rejected promise is automatically forwarded to next(error).
 *
 * Usage:
 *   router.get('/example', catchAsync(async (req, res) => { ... }));
 *
 * @param {Function} fn - Async function with signature (req, res, next).
 * @returns {Function}  - Express-compatible middleware.
 */
const catchAsync = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

module.exports = catchAsync;
