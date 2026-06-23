const mongoose = require("mongoose");

/**
 * Matches the AppointmentBooking.jsx form state exactly:
 * patientName, phoneNumber, doctorId, preferredDate, preferredTime.
 *
 * doctorName / specialty are snapshotted on the server from the Doctor
 * document at booking time (never trusted from the client), so historical
 * appointments still show the correct doctor info even if that doctor later
 * changes their specialty or name.
 */
const appointmentSchema = new mongoose.Schema(
  {
    // Linked automatically if the request was made by a logged-in patient.
    // Left null for guest bookings (the public form does not require login).
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    patientName: {
      type: String,
      required: [true, "Patient name is required."],
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: [true, "A valid phone number is required."],
      trim: true,
      match: [/^\+?[\d\s-]{7,}$/, "A valid phone number is required."],
    },

    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Please select a specialist."],
    },
    doctorName: { type: String, required: true, trim: true },
    specialty: { type: String, required: true, trim: true },

    preferredDate: {
      type: Date,
      required: [true, "Please select a preferred date."],
    },
    preferredTime: {
      type: String, // stored as "HH:mm" to mirror the <input type="time">
      required: [true, "Please select a preferred time."],
      match: [/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format"],
    },

    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
    },
    notes: { type: String, trim: true, default: "" },
  },
  { timestamps: true } // createdAt acts as "submittedAt"
);

// A doctor cannot be double-booked for the same date + time while the
// appointment is still active (pending/confirmed).
appointmentSchema.index(
  { doctor: 1, preferredDate: 1, preferredTime: 1 },
  {
    unique: true,
    partialFilterExpression: { status: { $in: ["pending", "confirmed"] } },
  }
);

module.exports = mongoose.model("Appointment", appointmentSchema);
