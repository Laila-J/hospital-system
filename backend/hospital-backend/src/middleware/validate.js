const { validationResult } = require("express-validator");
const ApiError = require("../utils/apiError");

/**
 * Runs an array of express-validator chains, then collects any failures
 * into a flat { fieldName: "message" } object - the exact same shape the
 * React forms already use for their per-field error state (emailError,
 * passwordError, firstNameError, ...). This lets the frontend do:
 *
 *   const { errors } = await res.json();
 *   setEmailError(errors.email || "");
 *   setPasswordError(errors.password || "");
 *
 * without any extra mapping logic.
 */
function validate(validations) {
  return async (req, res, next) => {
    await Promise.all(validations.map((validation) => validation.run(req)));

    const result = validationResult(req);
    if (result.isEmpty()) return next();

    const fieldErrors = {};
    result.array().forEach((err) => {
      // Keep the first error per field only (mirrors the frontend, which
      // shows one error message per field at a time)
      if (!fieldErrors[err.path]) {
        fieldErrors[err.path] = err.msg;
      }
    });

    next(new ApiError(400, "Please fix the highlighted fields.", fieldErrors));
  };
}

module.exports = validate;
