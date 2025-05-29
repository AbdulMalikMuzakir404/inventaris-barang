const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const { registerValidation } = require("../validation/registerValidation");
const { loginValidation } = require("../validation/loginValidation");

exports.register = [
  registerValidation,

  async (req, res) => {
    const { nama, username, email, password } = req.body;

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await User.create({
        nama,
        username,
        email,
        password: hashedPassword,
      });

      return res.status(201).json({
        success: true,
        message: "Registrasi berhasil",
        data: {
          id: newUser.id,
          nama: newUser.nama,
          username: newUser.username,
          email: newUser.email,
        },
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Terjadi kesalahan saat registrasi",
        error: err.message,
      });
    }
  },
];

// Login
exports.login = [
  loginValidation,

  async (req, res) => {
    const { username, password } = req.body;

    try {
      const user = await User.findOne({ where: { username } });

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Username atau password salah",
        });
      }

      const match = await bcrypt.compare(password, user.password);

      if (!match) {
        return res.status(401).json({
          success: false,
          message: "Username atau password salah",
        });
      }

      const token = jwt.sign(
        {
          id: user.id,
          username: user.username,
          nama: user.nama,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      return res.status(200).json({
        success: true,
        message: "Login berhasil",
        data: {
          user: {
            id: user.id,
            nama: user.nama,
            username: user.username,
            email: user.email,
          },
          token,
        },
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Gagal login",
        error: err.message,
      });
    }
  },
];

exports.getProfile = (req, res) => {
  try {
    const { id, username, nama } = req.user;

    if (!id || !username) {
      return res.status(400).json({
        message: "Data user tidak lengkap dari token",
      });
    }

    res.json({
      user: { id, username, nama },
    });
  } catch (error) {
    console.error("Error di getProfile:", error);
    return res.status(500).json({
      message: "Terjadi kesalahan saat mengambil data profil user",
    });
  }
};
