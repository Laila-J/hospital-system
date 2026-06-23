const express = require("express");
const rateLimit = require("express-rate-limit");
const validate = require("../middleware/validate");
const { protect } = require("../middleware/auth");
const {
  registerValidators,
  loginValidators,
  forgotPasswordValidators,
  resetPasswordValidators,
} = require("../validators/authValidators");
const {
  register,
  login,
  getMe,
  logout,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");

const router = express.Router();

// Throttle auth endpoints to slow down brute-force / credential-stuffing
// attacks, without affecting normal users.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many attempts. Please try again later.",
  },
});

// POST /api/auth/register  -> SignUp.jsx
router.post("/register", authLimiter, validate(registerValidators), register);

// POST /api/auth/login  -> LogIn.jsx
router.post("/login", authLimiter, validate(loginValidators), login);

// POST /api/auth/logout
router.post("/logout", logout);

// GET /api/auth/me  -> profile of the currently logged-in user
router.get("/me", protect, getMe);

// POST /api/auth/forgot-password  -> request a reset link by email
router.post(
  "/forgot-password",
  authLimiter,
  validate(forgotPasswordValidators),
  forgotPassword
);

// POST /api/auth/reset-password/:token  -> ResetPassword.jsx
router.post(
  "/reset-password/:token",
  authLimiter,
  validate(resetPasswordValidators),
  resetPassword
);

module.exports = router;
