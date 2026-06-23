const { body, param } = require("express-validator");

/**
 * Mirrors the exact validation already implemented client-side in
 * SignUp.jsx, so the server simply re-enforces the same rules
 * (never trust the client) and returns matching error messages.
 */
const registerValidators = [
  body("firstName").trim().notEmpty().withMessage("First name is required"),
  body("lastName").trim().notEmpty().withMessage("Last name is required"),
  body("gender")
    .optional({ values: "falsy" })
    .isIn(["Male", "Female"])
    .withMessage("Gender must be Male or Female"),
  body("nationalNumber")
    .trim()
    .notEmpty()
    .withMessage("National number is required"),
  body("profileType")
    .notEmpty()
    .withMessage("Please choose your profile type")
    .bail()
    .isIn(["Doctor", "Patient"])
    .withMessage("Please choose your profile type"),

  // Doctor-only fields
  body("occupation")
    .if(body("profileType").equals("Doctor"))
    .trim()
    .notEmpty()
    .withMessage("Occupation is required"),
  body("licenseSource")
    .if(body("profileType").equals("Doctor"))
    .trim()
    .notEmpty()
    .withMessage("License source is required"),
  body("yearsOfExperience")
    .optional({ values: "falsy" })
    .isIn(["1 - 5", "5 - 10", "10 +"])
    .withMessage("Invalid years of experience"),

  // Patient-only fields
  body("dateOfBirth")
    .if(body("profileType").equals("Patient"))
    .notEmpty()
    .withMessage("Date of birth is required")
    .bail()
    .isISO8601()
    .withMessage("Invalid date of birth"),
  body("bloodType")
    .if(body("profileType").equals("Patient"))
    .notEmpty()
    .withMessage("You must choose your blood type")
    .bail()
    .isIn(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"])
    .withMessage("You must choose your blood type"),
  body("allergies")
    .if(body("profileType").equals("Patient"))
    .trim()
    .notEmpty()
    .withMessage("Please declare if you have any allergies"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required!")
    .bail()
    .isEmail()
    .withMessage("Invalid email!"),
  body("password")
    .notEmpty()
    .withMessage("Password is required!")
    .bail()
    .isLength({ min: 8 })
    .withMessage("Password must be atleast 8 characters!"),
];

const loginValidators = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required!")
    .bail()
    .isEmail()
    .withMessage("Invalid email!"),
  body("password")
    .notEmpty()
    .withMessage("Password is required!")
    .bail()
    .isLength({ min: 8 })
    .withMessage("Password must be atleast 8 characters!"),
];

const forgotPasswordValidators = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required!")
    .bail()
    .isEmail()
    .withMessage("Invalid email!"),
];

const resetPasswordValidators = [
  param("token").notEmpty().withMessage("Reset token is missing"),
  body("password")
    .notEmpty()
    .withMessage("Password is required!")
    .bail()
    .isLength({ min: 8 })
    .withMessage("Password must be atleast 8 characters!"),
];

module.exports = {
  registerValidators,
  loginValidators,
  forgotPasswordValidators,
  resetPasswordValidators,
};
