const authService = require("../services/auth.service");

exports.register = [
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

exports.updateProfile = async (req, res) => {
  try {
    const updatedUser = await authService.updateProfile(req.user.id, req.body);

    res.json({
      success: true,
      message: "Profil berhasil diperbarui",
      data: {
        id: updatedUser.id,
        nama: updatedUser.nama,
        username: updatedUser.username,
        email: updatedUser.email,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Gagal memperbarui profil",
      error: error.message,
    });
  }
};

exports.changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return res.status(400).json({
      success: false,
      message: "Password lama dan baru wajib diisi",
    });
  }

  try {
    await authService.changePassword(req.user.id, oldPassword, newPassword);

    res.json({
      success: true,
      message: "Password berhasil diubah",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Gagal mengubah password",
      error: error.message,
    });
  }
};
