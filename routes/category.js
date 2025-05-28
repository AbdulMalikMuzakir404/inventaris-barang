const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");
const { categoryValidation } = require("../validation/categoryValidation");
const authMiddleware = require("../middlewares/authMiddleware");

router.use(authMiddleware);

/**
 * @swagger
 * tags:
 *   name: Kategori
 *   description: Manajemen data kategori
 */

/**
 * @swagger
 * /api/category:
 *   get:
 *     summary: Ambil semua data kategori
 *     tags: [Kategori]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Daftar kategori berhasil diambil
 */
router.get("/", categoryController.getAll);

/**
 * @swagger
 * /api/category/{id}:
 *   get:
 *     summary: Ambil data kategori berdasarkan ID
 *     tags: [Kategori]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID kategori
 *     responses:
 *       200:
 *         description: Data kategori ditemukan
 *       404:
 *         description: Kategori tidak ditemukan
 */
router.get("/:id", categoryController.getById);

/**
 * @swagger
 * /api/category:
 *   post:
 *     summary: Tambah data kategori
 *     tags: [Kategori]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               kode:
 *                 type: string
 *               nama:
 *                 type: string
 *     responses:
 *       201:
 *         description: Kategori berhasil ditambahkan
 */
router.post("/", categoryValidation, categoryController.create);

/**
 * @swagger
 * /api/category/{id}:
 *   put:
 *     summary: Update data kategori
 *     tags: [Kategori]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               kode:
 *                 type: string
 *               nama:
 *                 type: string
 *     responses:
 *       200:
 *         description: Kategori berhasil diupdate
 *       404:
 *         description: Kategori tidak ditemukan
 */
router.put("/:id", categoryValidation, categoryController.update);

/**
 * @swagger
 * /api/category/{id}:
 *   delete:
 *     summary: Hapus data kategori
 *     tags: [Kategori]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Kategori berhasil dihapus
 *       404:
 *         description: Kategori tidak ditemukan
 */
router.delete("/:id", categoryController.remove);

module.exports = router;
