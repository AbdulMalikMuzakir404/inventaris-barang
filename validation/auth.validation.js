const { body, validationResult } = require("express-validator");
const { User } = require("../models");

const validate = (validations) => {
  return async (req, res, next) => {
    for (let validation of validations) {
      const result = await validation.run(req);
      if (result.errors.length) break;
    }

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
  };
};

const registerValidation = validate([
  body("nama").notEmpty().withMessage("Nama wajib diisi"),

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
    .withMessage("Password minimal 6 karakter"),

  body("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Password dan konfirmasi tidak cocok");
    }
    return true;
  }),
]);

const loginValidation = validate([
  body("username").notEmpty().withMessage("Username wajib diisi"),
  body("password").notEmpty().withMessage("Password wajib diisi"),
]);

const updateProfileValidation = validate([
  body("nama").notEmpty().withMessage("Nama tidak boleh kosong"),
  body("username").notEmpty().withMessage("Username tidak boleh kosong"),
  body("email")
    .isEmail()
    .withMessage("Email tidak valid")
    .notEmpty()
    .withMessage("Email tidak boleh kosong"),
]);


const changePasswordValidation = validate([
  body("oldPassword")
    .notEmpty()
    .withMessage("Password lama tidak boleh kosong"),

  body("newPassword")
    .notEmpty()
    .withMessage("Password baru tidak boleh kosong")
    .isLength({ min: 6 })
    .withMessage("Password baru minimal 6 karakter"),

  body("confirmPassword")
    .notEmpty()
    .withMessage("Konfirmasi password tidak boleh kosong")
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error("Konfirmasi password tidak cocok");
      }
      return true;
    }),
]);

module.exports = {
  registerValidation,
  loginValidation,
  updateProfileValidation,
  changePasswordValidation,
};
