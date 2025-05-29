const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Autentikasi user
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registrasi user baru
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
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               confirmPassword:
 *                 type: string
 *     responses:
 *       201:
 *         description: Registrasi berhasil
 *       400:
 *         description: Gagal validasi atau username sudah dipakai
 *       500:
 *         description: Error server
 */
router.post("/register", authController.register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
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
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login berhasil dan token dikembalikan
 *       401:
 *         description: Password salah
 *       404:
 *         description: User tidak ditemukan
 *       500:
 *         description: Error server
 */
router.post("/login", authController.login);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Ambil data profil user yang sedang login
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Berhasil mengambil data user
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
 *       401:
 *         description: Token tidak valid atau tidak ada
 */
router.get("/me", authMiddleware, authController.getProfile);

module.exports = router;
