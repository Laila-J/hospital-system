const jwt = require("jsonwebtoken");
const asyncHandler = require("./asyncHandler");
const ApiError = require("../utils/apiError");
const User = require("../models/User");

/**
 * Verifies the JWT sent either as:
 *   Authorization: Bearer <token>
 * or as an httpOnly "token" cookie (set by /auth/login).
 * On success, attaches the authenticated user to req.user.
 */
const protect = asyncHandler(async (req, res, next) => {
  let token;

  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    throw new ApiError(401, "Not authorized, no token provided.");
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    throw new ApiError(401, "Not authorized, token is invalid or expired.");
  }

  const user = await User.findById(decoded.id);
  if (!user) {
    throw new ApiError(401, "Not authorized, user no longer exists.");
  }

  req.user = user;
  next();
});

/**
 * Same as `protect`, but never throws - if there is no/invalid token it
 * simply continues with req.user = null. Used on public routes (like
 * booking an appointment) that behave slightly differently for logged-in
 * users without requiring login.
 */
const attachUserIfPresent = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token =
    authHeader && authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : req.cookies?.token;

  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
  } catch (err) {
    req.user = null;
  }
  next();
});

/**
 * Restricts a route to specific roles, e.g. authorize("admin", "receptionist").
 * Must be used after `protect`.
 */
const authorize =
  (...roles) =>
  (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      throw new ApiError(
        403,
        `Role '${req.user ? req.user.role : "guest"}' is not allowed to access this resource.`
      );
    }
    next();
  };

module.exports = { protect, attachUserIfPresent, authorize };
