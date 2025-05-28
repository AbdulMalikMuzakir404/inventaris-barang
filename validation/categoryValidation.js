const { body, validationResult } = require("express-validator");

exports.categoryValidation = [
  body("kode")
  .notEmpty()
  .withMessage("Kode kategori wajib diisi")
  .bail()
  .notEmpty()
  .withMessage("Kode kategori wajib diisi")
  .bail()
  .custom(async (value, { req }) => {
    const { Kategori } = require("../models");
    const where = { kode: value };
    if (req.params && req.params.id) {
      where.id = { $ne: req.params.id };
    }
    const existing = await Kategori.findOne({ where });
    if (existing) {
      throw new Error("Kode kategori sudah digunakan");
    }
    return true;
  }),
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
