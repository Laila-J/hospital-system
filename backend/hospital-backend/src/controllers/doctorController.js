const asyncHandler = require("../middleware/asyncHandler");
const ApiError = require("../utils/apiError");
const User = require("../models/User");
const Appointment = require("../models/Appointment");

/**
 * Shapes a Doctor user document into exactly the object AppointmentBooking.jsx
 * expects (same keys as its local DEFAULT_DOCTORS array), so the frontend
 * can swap `doctors={DEFAULT_DOCTORS}` for the data fetched here with zero
 * other changes.
 */
function toDoctorDTO(doc) {
  return {
    id: doc._id,
    nameEn: `Dr. ${doc.firstName} ${doc.lastName}`,
    nameAr: doc.nameAr || `د. ${doc.firstName} ${doc.lastName}`,
    specialtyEn: doc.occupation,
    specialtyAr: doc.specialtyAr || doc.occupation,
    available: doc.available,
  };
}

// @desc    List all doctors (optionally filter by specialty/availability)
// @route   GET /api/doctors
// @access  Public
const getDoctors = asyncHandler(async (req, res) => {
  const filter = { profileType: "Doctor" };

  if (req.query.specialty) {
    filter.occupation = new RegExp(req.query.specialty, "i");
  }
  if (req.query.available !== undefined) {
    filter.available = req.query.available === "true";
  }

  const doctors = await User.find(filter).sort({ firstName: 1 });
  res.status(200).json({
    success: true,
    count: doctors.length,
    doctors: doctors.map(toDoctorDTO),
  });
});

// @desc    Get a single doctor's public profile
// @route   GET /api/doctors/:id
// @access  Public
const getDoctorById = asyncHandler(async (req, res) => {
  const doctor = await User.findOne({
    _id: req.params.id,
    profileType: "Doctor",
  });

  if (!doctor) {
    throw new ApiError(404, "Doctor not found.");
  }

  res.status(200).json({ success: true, doctor: toDoctorDTO(doctor) });
});

// @desc    Get a doctor's already-booked time slots for a given date
//          (handy for disabling taken <input type="time"> values client-side)
// @route   GET /api/doctors/:id/availability?date=YYYY-MM-DD
// @access  Public
const getDoctorAvailability = asyncHandler(async (req, res) => {
  const { date } = req.query;
  if (!date) {
    throw new ApiError(400, "A 'date' query parameter (YYYY-MM-DD) is required.");
  }

  const doctor = await User.findOne({
    _id: req.params.id,
    profileType: "Doctor",
  });
  if (!doctor) {
    throw new ApiError(404, "Doctor not found.");
  }

  const bookedAppointments = await Appointment.find({
    doctor: doctor._id,
    preferredDate: new Date(date),
    status: { $in: ["pending", "confirmed"] },
  }).select("preferredTime -_id");

  res.status(200).json({
    success: true,
    date,
    bookedTimes: bookedAppointments.map((a) => a.preferredTime),
  });
});

// @desc    Toggle a doctor's own availability (e.g. on vacation)
// @route   PATCH /api/doctors/me/availability
// @access  Private (doctor only)
const updateMyAvailability = asyncHandler(async (req, res) => {
  if (typeof req.body.available !== "boolean") {
    throw new ApiError(400, "'available' must be true or false.");
  }

  req.user.available = req.body.available;
  await req.user.save();

  res.status(200).json({ success: true, doctor: toDoctorDTO(req.user) });
});

module.exports = {
  getDoctors,
  getDoctorById,
  getDoctorAvailability,
  updateMyAvailability,
  toDoctorDTO,
};
