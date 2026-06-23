const express = require("express");
const rateLimit = require("express-rate-limit");
const validate = require("../middleware/validate");
const { protect, attachUserIfPresent, authorize } = require("../middleware/auth");
const { createAppointmentValidators } = require("../validators/appointmentValidators");
const {
  createAppointment,
  getMyAppointments,
  getDoctorAppointments,
  getAppointments,
  getAppointmentById,
  updateAppointmentStatus,
  cancelAppointment,
} = require("../controllers/appointmentController");

const router = express.Router();

// Prevents the booking form from being spammed/scripted.
const bookingLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many booking attempts. Please try again later.",
  },
});

// POST /api/appointments  -> AppointmentBooking.jsx submit()
// Public: works for guests, but auto-links the appointment to the
// account if the request includes a valid JWT for a patient.
router.post(
  "/",
  bookingLimiter,
  attachUserIfPresent,
  validate(createAppointmentValidators),
  createAppointment
);

// GET /api/appointments/me  -> "My appointments" page for a logged-in patient
router.get("/me", protect, authorize("patient"), getMyAppointments);

// GET /api/appointments/doctor  -> a doctor's own schedule
router.get("/doctor", protect, authorize("doctor"), getDoctorAppointments);

// GET /api/appointments  -> admin/receptionist dashboard, with filters
router.get("/", protect, authorize("admin", "receptionist"), getAppointments);

// GET /api/appointments/:id
router.get("/:id", protect, getAppointmentById);

// PATCH /api/appointments/:id/status  -> confirm / complete / cancel
router.patch(
  "/:id/status",
  protect,
  authorize("admin", "receptionist", "doctor"),
  updateAppointmentStatus
);

// DELETE /api/appointments/:id  -> cancel
router.delete("/:id", protect, cancelAppointment);

module.exports = router;
