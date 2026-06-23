const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

/**
 * Single collection for all account types, matching the SignUp.jsx form:
 * firstName, lastName, gender, nationalNumber, profileType (Doctor/Patient),
 * occupation + yearsOfExperience + licenseSource (doctor only),
 * dateOfBirth + bloodType + allergies (patient only), email, password.
 *
 * "admin" and "receptionist" roles are not self-registrable from the public
 * SignUp form (there is no such option in the UI) - they are created via the
 * seed script or by an existing admin, but share this same schema so the
 * same auth/JWT/RBAC logic works for everyone.
 */
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      maxlength: 50,
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
      maxlength: 50,
    },
    gender: {
      type: String,
      enum: ["Male", "Female"],
    },
    nationalNumber: {
      type: String,
      required: [true, "National number is required"],
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 8,
      select: false,
    },
    profileType: {
      type: String,
      required: [true, "Please choose your profile type"],
      enum: ["Doctor", "Patient", "Admin", "Receptionist"],
    },
    // Used by auth/RBAC middleware - always the lowercase of profileType
    role: {
      type: String,
      enum: ["doctor", "patient", "admin", "receptionist"],
    },

    // ---- Doctor-only fields ----
    occupation: {
      type: String, // medical specialty, e.g. "Cardiology"
      trim: true,
      required: [
        function () {
          return this.profileType === "Doctor";
        },
        "Occupation is required",
      ],
    },
    yearsOfExperience: {
      type: String,
      enum: ["1 - 5", "5 - 10", "10 +"],
    },
    licenseSource: {
      type: String,
      trim: true,
      required: [
        function () {
          return this.profileType === "Doctor";
        },
        "License source is required",
      ],
    },
    available: {
      // whether the doctor currently accepts new appointments
      type: Boolean,
      default: true,
    },
    // Optional bilingual display fields so the response can map 1:1 onto
    // AppointmentBooking.jsx's DEFAULT_DOCTORS shape (nameAr / specialtyAr).
    nameAr: { type: String, trim: true },
    specialtyAr: { type: String, trim: true },

    // ---- Patient-only fields ----
    dateOfBirth: {
      type: Date,
      required: [
        function () {
          return this.profileType === "Patient";
        },
        "Date of birth is required",
      ],
    },
    bloodType: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
      required: [
        function () {
          return this.profileType === "Patient";
        },
        "You must choose your blood type",
      ],
    },
    allergies: {
      type: String,
      trim: true,
      default: "None",
    },

    // ---- Password reset ----
    resetPasswordToken: { type: String, select: false },
    resetPasswordExpire: { type: Date, select: false },
  },
  { timestamps: true }
);

// Keep `role` in sync with `profileType` and hash password on change
userSchema.pre("save", async function (next) {
  if (this.isModified("profileType") || this.isNew) {
    this.role = this.profileType.toLowerCase();
  }

  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare a plaintext password against the stored hash
userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

// Issue a signed JWT for this user
userSchema.methods.getSignedJwtToken = function (remember = false) {
  const expiresIn = remember
    ? process.env.JWT_REMEMBER_EXPIRE || "30d"
    : process.env.JWT_EXPIRE || "1d";
  return jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET, {
    expiresIn,
  });
};

// Generate a one-time password-reset token; store only its hash in the DB
userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  const minutes = Number(process.env.RESET_TOKEN_EXPIRE_MINUTES) || 10;
  this.resetPasswordExpire = Date.now() + minutes * 60 * 1000;

  return resetToken; // raw token - only this one is emailed to the user
};

// Never leak sensitive fields in JSON responses
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.resetPasswordToken;
  delete obj.resetPasswordExpire;
  delete obj.__v;
  return obj;
};

module.exports = mongoose.model("User", userSchema);
