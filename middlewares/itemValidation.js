const { body, validationResult } = require("express-validator");

exports.itemValidation = [
  body("nama").notEmpty().withMessage("Nama barang wajib diisi").bail(),

  body("stok")
    .notEmpty()
    .withMessage("Stok barang wajib diisi")
    .bail()
    .isInt({ min: 0 })
    .withMessage("Stok harus berupa angka dan minimal 0")
    .bail(),

  body("kategoriId")
    .notEmpty()
    .withMessage("kategoriId wajib diisi")
    .bail()
    .isInt({ min: 1 })
    .withMessage("kategoriId harus berupa angka dan minimal 1")
    .bail(),

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
