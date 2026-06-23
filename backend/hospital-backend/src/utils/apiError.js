/**
 * Custom error class for predictable, controlled API errors.
 * `statusCode` drives the HTTP status returned to the client.
 * `fieldErrors` (optional) is a { fieldName: "message" } map so the React
 * forms (which already track errors per field, e.g. emailError, passwordError)
 * can plug the response directly into their existing error state.
 */
class ApiError extends Error {
  constructor(statusCode, message, fieldErrors = null) {
    super(message);
    this.statusCode = statusCode;
    this.fieldErrors = fieldErrors;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ApiError;
