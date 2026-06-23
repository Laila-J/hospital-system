const asyncHandler = require("../middleware/asyncHandler");
const Newsletter = require("../models/Newsletter");

// @desc    Subscribe an email to the newsletter
// @route   POST /api/newsletter/subscribe
// @access  Public
// @body    email
const subscribe = asyncHandler(async (req, res) => {
  const email = req.body.email.toLowerCase().trim();

  // Idempotent: resubscribing with the same email is still a "success"
  // from the user's point of view (matches the toast in Home.jsx, which
  // only ever shows success or invalid-email).
  await Newsletter.updateOne(
    { email },
    { $setOnInsert: { email } },
    { upsert: true }
  );

  res.status(200).json({
    success: true,
    message: "You have subscribed to our newsletter.",
  });
});

module.exports = { subscribe };
