const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // 1. Cek apakah ada Authorization header
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token diperlukan" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    next();
  } catch (err) {
    // 4. Tangani error token secara spesifik
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token kedaluwarsa" });
    } else if (err.name === "JsonWebTokenError") {
      return res.status(403).json({ message: "Token tidak valid" });
    } else {
      return res.status(500).json({ message: "Autentikasi gagal" });
    }
  }
};
