const express = require("express");

const {
  register,
  login,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");


const {
  validateRegister,
  validateLogin,
  validateForgotPassword,
  validateResetPassword,
} = require("../middlewares/authValidation");
const router = express.Router();

router.post(
  "/register",
  validateRegister,
  register
);

router.post(
  "/login",
  validateLogin,
  login
);

router.post(
  "/forgot-password",
  validateForgotPassword,
  forgotPassword
);

router.post(
  "/reset-password",
  validateResetPassword,
  resetPassword
);

module.exports = router;