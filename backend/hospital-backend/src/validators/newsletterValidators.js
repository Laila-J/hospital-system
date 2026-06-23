const { body } = require("express-validator");

const subscribeValidators = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Invalid email address.")
    .bail()
    .isEmail()
    .withMessage("Invalid email address."),
];

module.exports = { subscribeValidators };
