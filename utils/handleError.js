function handleError(
  res,
  error,
  defaultMessage = "Terjadi kesalahan",
  status = 400
) {
  let message = defaultMessage;

  if (error.name === "SequelizeForeignKeyConstraintError") {
    message = "Relasi data tidak valid atau tidak ditemukan";
  } else if (error.name === "SequelizeUniqueConstraintError") {
    message =
      "Data duplikat. Pastikan nilai unik tidak sama dengan yang sudah ada";
  } else if (error.name === "SequelizeValidationError") {
    message = error.errors?.[0]?.message || "Validasi data gagal";
  }

  res.status(status).json({
    success: false,
    message,
    error: error.message,
  });
}

module.exports = handleError;
