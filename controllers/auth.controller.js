const authService = require("../services/auth.service");
const { registerValidation } = require("../validation/register.validation");
const { loginValidation } = require("../validation/login.validation");

exports.register = [
  registerValidation,

  async (req, res) => {
    const { nama, username, email, password } = req.body;

    try {
      const newUser = await authService.registerUser({
        nama,
        username,
        email,
        password,
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

exports.login = [
  loginValidation,

  async (req, res) => {
    const { username, password } = req.body;

    try {
      const user = await authService.findUserByUsername(username);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Username atau password salah",
        });
      }

      const match = await authService.verifyPassword(password, user.password);
      if (!match) {
        return res.status(401).json({
          success: false,
          message: "Username atau password salah",
        });
      }

      const token = authService.generateToken(user);

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
      success: true,
      message: "Profil user berhasil diambil",
      data: { id, username, nama },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Terjadi kesalahan saat mengambil data profil user",
      error: error.message,
    });
  }
};
