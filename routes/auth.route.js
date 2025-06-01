const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const {
  loginValidation,
  registerValidation,
  updateProfileValidation,
  changePasswordValidation,
} = require("../validation/auth.validation");

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Manajemen autentikasi dan profil pengguna
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registrasi pengguna baru
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nama
 *               - username
 *               - email
 *               - password
 *               - confirmPassword
 *             properties:
 *               nama:
 *                 type: string
 *                 example: John Doe
 *               username:
 *                 type: string
 *                 example: johndoe
 *               email:
 *                 type: string
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 example: secret123
 *               confirmPassword:
 *                 type: string
 *                 example: secret123
 *     responses:
 *       201:
 *         description: Registrasi berhasil
 *       400:
 *         description: Validasi gagal atau email/username sudah digunakan
 *       500:
 *         description: Terjadi kesalahan server
 */
router.post("/register", registerValidation, authController.register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login pengguna
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: johndoe
 *               password:
 *                 type: string
 *                 example: secret123
 *     responses:
 *       200:
 *         description: Login berhasil, token dikembalikan
 *       401:
 *         description: Username atau password salah
 *       500:
 *         description: Terjadi kesalahan server
 */
router.post("/login", loginValidation, authController.login);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Mendapatkan data profil pengguna yang sedang login
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Data pengguna berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     username:
 *                       type: string
 *                     nama:
 *                       type: string
 *                     email:
 *                       type: string
 *       401:
 *         description: Token tidak valid atau tidak ditemukan
 */
router.get("/me", authMiddleware, authController.me);

/**
 * @swagger
 * /api/auth/get-profile:
 *   get:
 *     summary: Mendapatkan data profil pengguna (versi DB)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Data pengguna berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Profil user berhasil diambil
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     username:
 *                       type: string
 *                       example: johndoe
 *                     nama:
 *                       type: string
 *                       example: John Doe
 *                     email:
 *                       type: string
 *                       example: johndoe@example.com
 *       401:
 *         description: Token tidak valid atau tidak ditemukan
 */
router.get("/get-profile", authMiddleware, authController.getProfile);

/**
 * @swagger
 * /api/auth/update-profile:
 *   put:
 *     summary: Memperbarui informasi profil pengguna
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nama
 *               - username
 *               - email
 *             properties:
 *               nama:
 *                 type: string
 *                 example: John Doe
 *               username:
 *                 type: string
 *                 example: johndoe
 *               email:
 *                 type: string
 *                 example: johndoe@example.com
 *     responses:
 *       200:
 *         description: Profil berhasil diperbarui
 *       400:
 *         description: Validasi gagal atau input tidak valid
 *       401:
 *         description: Token tidak valid
 */
router.put(
  "/update-profile",
  authMiddleware,
  updateProfileValidation,
  authController.updateProfile
);

/**
 * @swagger
 * /api/auth/change-password:
 *   put:
 *     summary: Mengubah password pengguna
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - oldPassword
 *               - newPassword
 *               - confirmPassword
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 example: oldpassword123
 *                 description: Password lama pengguna
 *               newPassword:
 *                 type: string
 *                 example: newpassword456
 *                 description: Password baru yang diinginkan
 *               confirmPassword:
 *                 type: string
 *                 example: newpassword456
 *                 description: Harus sama dengan `newPassword`
 *     responses:
 *       200:
 *         description: Password berhasil diubah
 *       400:
 *         description: Validasi gagal atau password lama salah
 *       401:
 *         description: Token tidak valid atau tidak ditemukan
 */
router.put(
  "/change-password",
  authMiddleware,
  changePasswordValidation,
  authController.changePassword
);

module.exports = router;
