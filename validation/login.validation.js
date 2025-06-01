const { body, validationResult } = require("express-validator");
const { User } = require("../models");

exports.loginValidation = [
  body("username").notEmpty().withMessage("Username wajib diisi").bail(),

  body("password").notEmpty().withMessage("Password wajib diisi").bail(),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const formattedErrors = errors.array().map((err) => ({
        field: err.param,
        message: err.msg,
      }));
      return res.status(400).json({
        success: false,
        message: "Validasi gagal",
        errors: formattedErrors,
      });
    }
    next();
  },
];
