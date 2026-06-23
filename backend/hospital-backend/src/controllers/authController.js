const crypto = require("crypto");
const asyncHandler = require("../middleware/asyncHandler");
const ApiError = require("../utils/apiError");
const sendEmail = require("../utils/sendEmail");
const User = require("../models/User");

/**
 * Builds the public-facing payload sent back after register/login.
 */
function buildAuthResponse(user, token) {
  return {
    success: true,
    token,
    user,
  };
}

// @desc    Register a new Doctor or Patient account
// @route   POST /api/auth/register
// @access  Public
// @body    firstName, lastName, gender, nationalNumber, profileType,
//          occupation, yearsOfExperience, licenseSource (Doctor),
//          dateOfBirth, bloodType, allergies (Patient), email, password
const register = asyncHandler(async (req, res) => {
  const {
    firstName,
    lastName,
    gender,
    nationalNumber,
    profileType,
    occupation,
    yearsOfExperience,
    licenseSource,
    dateOfBirth,
    bloodType,
    allergies,
    email,
    password,
  } = req.body;

  const emailTaken = await User.findOne({ email: email.toLowerCase() });
  if (emailTaken) {
    throw new ApiError(409, "Email already in use.", {
      email: "An account with this email already exists.",
    });
  }

  const nationalNumberTaken = await User.findOne({ nationalNumber });
  if (nationalNumberTaken) {
    throw new ApiError(409, "National number already in use.", {
      nationalNumber: "This national number is already registered.",
    });
  }

  const user = await User.create({
    firstName,
    lastName,
    gender,
    nationalNumber,
    profileType,
    occupation: profileType === "Doctor" ? occupation : undefined,
    yearsOfExperience: profileType === "Doctor" ? yearsOfExperience : undefined,
    licenseSource: profileType === "Doctor" ? licenseSource : undefined,
    dateOfBirth: profileType === "Patient" ? dateOfBirth : undefined,
    bloodType: profileType === "Patient" ? bloodType : undefined,
    allergies: profileType === "Patient" ? allergies : undefined,
    email,
    password,
  });

  const token = user.getSignedJwtToken();
  res.status(201).json(buildAuthResponse(user, token));
});

// @desc    Log in with email + password
// @route   POST /api/auth/login
// @access  Public
// @body    email, password, remember (boolean, from the "Remember me" checkbox)
const login = asyncHandler(async (req, res) => {
  const { email, password, remember } = req.body;

  const user = await User.findOne({ email: email.toLowerCase() }).select(
    "+password"
  );

  // Same generic message for "no such user" and "wrong password" so the
  // API never reveals which emails are registered.
  if (!user || !(await user.matchPassword(password))) {
    throw new ApiError(401, "Invalid email or password.", {
      password: "Invalid email or password.",
    });
  }

  const token = user.getSignedJwtToken(Boolean(remember));

  res
    .cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: (remember ? 30 : 1) * 24 * 60 * 60 * 1000,
    })
    .status(200)
    .json(buildAuthResponse(user, token));
});

// @desc    Get the currently logged-in user's profile
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, user: req.user });
});

// @desc    Log out (clears the auth cookie)
// @route   POST /api/auth/logout
// @access  Public
const logout = asyncHandler(async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ success: true, message: "Logged out." });
});

// @desc    Request a password-reset link by email
// @route   POST /api/auth/forgot-password
// @access  Public
// @body    email
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email: email.toLowerCase() });

  // Always respond with success, even if the email doesn't exist, so the
  // endpoint can't be used to find out which emails are registered.
  const genericResponse = {
    success: true,
    message:
      "If an account with that email exists, a password reset link has been sent.",
  };

  if (!user) {
    return res.status(200).json(genericResponse);
  }

  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${process.env.CLIENT_URL}/ResetPassword/${resetToken}`;

  try {
    await sendEmail({
      to: user.email,
      subject: "Al Othman Hospital - Password Reset",
      html: `
        <p>Hello ${user.firstName},</p>
        <p>You requested to reset your password. Click the link below (valid for
        ${process.env.RESET_TOKEN_EXPIRE_MINUTES || 10} minutes):</p>
        <p><a href="${resetUrl}">${resetUrl}</a></p>
        <p>If you did not request this, you can safely ignore this email.</p>
      `,
    });
  } catch (err) {
    // Roll back the token if the email genuinely failed to send, so the
    // user isn't locked out waiting on an email that never arrives.
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    throw new ApiError(500, "Email could not be sent. Please try again later.");
  }

  // In development, also return the raw token/link so it can be tested
  // without a working SMTP setup.
  if (process.env.NODE_ENV !== "production") {
    genericResponse.devResetToken = resetToken;
    genericResponse.devResetUrl = resetUrl;
  }

  res.status(200).json(genericResponse);
});

// @desc    Set a new password using the token emailed by forgotPassword
// @route   POST /api/auth/reset-password/:token
// @access  Public
// @body    password
const resetPassword = asyncHandler(async (req, res) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    throw new ApiError(400, "This reset link is invalid or has expired.");
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  const token = user.getSignedJwtToken();
  res.status(200).json(buildAuthResponse(user, token));
});

module.exports = {
  register,
  login,
  getMe,
  logout,
  forgotPassword,
  resetPassword,
};
