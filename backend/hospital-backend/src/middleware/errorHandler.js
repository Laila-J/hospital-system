const ApiError = require("../utils/apiError");

/**
 * Catches requests to undefined routes.
 */
function notFound(req, res, next) {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
}

/**
 * Single place where every error in the app ends up. Normalizes known
 * Mongoose errors (bad ObjectId, schema validation, duplicate key) into the
 * same { success:false, message, errors } shape as our own ApiError, so the
 * frontend never has to special-case different error formats.
 */
function errorHandler(err, req, res, next) {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Server error";
  let fieldErrors = err.fieldErrors || null;

  // Invalid MongoDB ObjectId (e.g. /api/doctors/123abc)
  if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid value for '${err.path}'.`;
  }

  // Mongoose schema validation errors
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = "Validation failed.";
    fieldErrors = {};
    Object.values(err.errors).forEach((e) => {
      fieldErrors[e.path] = e.message;
    });
  }

  // Duplicate key (unique index violation) - e.g. email, nationalNumber,
  // or double-booking the same doctor/date/time slot
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0];
    if (field === "doctor") {
      message = "This time slot is already booked. Please choose another time.";
    } else {
      message = `${field ? field.charAt(0).toUpperCase() + field.slice(1) : "Value"} already in use.`;
      fieldErrors = field ? { [field]: message } : null;
    }
  }

  // Malformed JSON body
  if (err.type === "entity.parse.failed") {
    statusCode = 400;
    message = "Malformed JSON in request body.";
  }

  if (process.env.NODE_ENV !== "production") {
    console.error(err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(fieldErrors ? { errors: fieldErrors } : {}),
  });
}

module.exports = { notFound, errorHandler };
