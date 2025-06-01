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
    const errors = validationResult(req).array();
    if (!req.file) {
      errors.push({
        path: "cover",
        msg: "Gambar cover wajib diunggah",
      });
    } else {
      const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
      if (!allowedTypes.includes(req.file.mimetype)) {
        errors.push({
          path: "cover",
          msg: "Cover harus berupa gambar JPG atau PNG",
        });
      }
    }

    if (errors.length > 0) {
      if (req.file) {
        deleteFile(req.file.filename);
      }

      const formattedErrors = errors.map((err) => ({
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
