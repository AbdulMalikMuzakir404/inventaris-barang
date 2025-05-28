const express = require("express");
const router = express.Router();
const itemController = require("../controllers/itemController");
const { itemValidation } = require("../middlewares/itemValidation");

/**
 * @swagger
 * tags:
 *   name: Barang
 *   description: Manajemen data barang
 */

/**
 * @swagger
 * /api/item:
 *   get:
 *     summary: Ambil semua data barang
 *     tags: [Barang]
 *     responses:
 *       200:
 *         description: Daftar barang berhasil diambil
 */
router.get("/", itemController.getAll);

/**
 * @swagger
 * /api/item/{id}:
 *   get:
 *     summary: Ambil data barang berdasarkan ID
 *     tags: [Barang]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID barang
 *     responses:
 *       200:
 *         description: Data barang ditemukan
 *       404:
 *         description: Barang tidak ditemukan
 */
router.get("/:id", itemController.getById);

/**
 * @swagger
 * /api/item:
 *   post:
 *     summary: Tambah data barang
 *     tags: [Barang]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nama:
 *                 type: string
 *               stok:
 *                 type: integer
 *               kategoriId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Barang berhasil ditambahkan
 */
router.post("/", itemValidation, itemController.create);

/**
 * @swagger
 * /api/item/{id}:
 *   put:
 *     summary: Update data barang
 *     tags: [Barang]
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
 *               nama:
 *                 type: string
 *               stok:
 *                 type: integer
 *               kategoriId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Barang berhasil diupdate
 *       404:
 *         description: Barang tidak ditemukan
 */
router.put("/:id", itemValidation, itemController.update);

/**
 * @swagger
 * /api/item/{id}:
 *   delete:
 *     summary: Hapus data barang
 *     tags: [Barang]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Barang berhasil dihapus
 *       404:
 *         description: Barang tidak ditemukan
 */
router.delete("/:id", itemController.remove);

module.exports = router;
