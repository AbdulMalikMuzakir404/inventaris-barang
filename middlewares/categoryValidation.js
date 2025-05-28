const { body, validationResult } = require("express-validator");

exports.categoryValidation = [
  body("nama").notEmpty().withMessage("Nama kategori wajib diisi").bail(),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const formattedErrors = errors.array().map((err) => ({
        field: err.path,
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
