const express = require("express");
const { protect, authorize } = require("../middleware/auth");
const {
  getDoctors,
  getDoctorById,
  getDoctorAvailability,
  updateMyAvailability,
} = require("../controllers/doctorController");

const router = express.Router();

// GET /api/doctors  -> populates the "Specialist / Doctor" <select> in
// AppointmentBooking.jsx (same shape as its local DEFAULT_DOCTORS array)
router.get("/", getDoctors);

// PATCH /api/doctors/me/availability  -> a doctor toggles their own status
router.patch(
  "/me/availability",
  protect,
  authorize("doctor"),
  updateMyAvailability
);

// GET /api/doctors/:id  -> single doctor public profile
router.get("/:id", getDoctorById);

// GET /api/doctors/:id/availability?date=YYYY-MM-DD  -> already-booked times
router.get("/:id/availability", getDoctorAvailability);

module.exports = router;
