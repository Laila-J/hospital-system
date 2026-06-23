const express = require("express");
const rateLimit = require("express-rate-limit");
const validate = require("../middleware/validate");
const { subscribeValidators } = require("../validators/newsletterValidators");
const { subscribe } = require("../controllers/newsletterController");

const router = express.Router();

const subscribeLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
});

// POST /api/newsletter/subscribe  -> Home.jsx newsletter form
router.post("/subscribe", subscribeLimiter, validate(subscribeValidators), subscribe);

module.exports = router;
