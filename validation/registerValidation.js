const { body, validationResult } = require("express-validator");
const { User } = require("../models");

exports.registerValidation = [
  body("nama").notEmpty().withMessage("Nama wajib diisi").bail(),

  body("username")
    .notEmpty()
    .withMessage("Username wajib diisi")
    .bail()
    .custom(async (value) => {
      const existingUser = await User.findOne({ where: { username: value } });
      if (existingUser) {
        throw new Error("Username sudah terpakai");
      }
      return true;
    }),

  body("email")
    .isEmail()
    .withMessage("Format email tidak valid")
    .bail()
    .custom(async (value) => {
      const existingUser = await User.findOne({ where: { email: value } });
      if (existingUser) {
        throw new Error("Email sudah terpakai");
      }
      return true;
    }),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password minimal 6 karakter")
    .bail(),

  body("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Password dan konfirmasi tidak cocok");
    }
    return true;
  }),

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
