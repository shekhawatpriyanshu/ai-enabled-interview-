const { body, validationResult } = require("express-validator");

// Email must end with .com or .in
const emailValidation = body("email")
  .trim()
  .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|in)$/)
  .withMessage("Email must end with .com or .in");

// Password:
// First letter uppercase
// At least one number
// At least one special character
// Minimum 8 characters
const passwordValidation = body("password")
  .matches(/^[A-Z](?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>]).{7,}$/)
  .withMessage(
    "Password must start with an uppercase letter, contain at least one number, one special character, and be at least 8 characters long"
  );

const nameValidation = body("name")
  .trim()
  .notEmpty()
  .withMessage("Name is required")
  .isLength({ min: 3 })
  .withMessage("Name must be at least 3 characters long");

const validateRegister = [
  nameValidation,
  emailValidation,
  passwordValidation,
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    next();
  },
];

const validateLogin = [
  emailValidation,
  passwordValidation,
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    next();
  },
];

module.exports = {
  validateRegister,
  validateLogin,
};