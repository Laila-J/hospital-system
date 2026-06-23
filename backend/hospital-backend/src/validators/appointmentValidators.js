const { body } = require("express-validator");

/**
 * Mirrors the validate() function inside AppointmentBooking.jsx exactly,
 * including the same phone regex and the "no past dates" rule.
 */
const createAppointmentValidators = [
  body("patientName")
    .trim()
    .notEmpty()
    .withMessage("Patient name is required."),

  body("phoneNumber")
    .trim()
    .notEmpty()
    .withMessage("A valid phone number is required.")
    .bail()
    .matches(/^\+?[\d\s-]{7,}$/)
    .withMessage("A valid phone number is required."),

  body("doctorId")
    .notEmpty()
    .withMessage("Please select a specialist.")
    .bail()
    .isMongoId()
    .withMessage("Please select a specialist."),

  body("preferredDate")
    .notEmpty()
    .withMessage("Please select a preferred date.")
    .bail()
    .isISO8601()
    .withMessage("Please select a preferred date.")
    .bail()
    .custom((value) => {
      const today = new Date().toISOString().split("T")[0];
      if (value < today) {
        throw new Error("Please select a future date.");
      }
      return true;
    }),

  body("preferredTime")
    .notEmpty()
    .withMessage("Please select a preferred time.")
    .bail()
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .withMessage("Please select a preferred time."),
];

module.exports = { createAppointmentValidators };
