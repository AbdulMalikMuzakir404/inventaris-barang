const express = require("express");
const router = express.Router();
const itemController = require("../controllers/item.controller");
const { itemValidation } = require("../validation/item.validation");
const authMiddleware = require("../middlewares/auth.middleware");
const upload = require("../middlewares/upload.middleware");

router.use(authMiddleware);

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
 *     summary: Ambil daftar semua barang
 *     description: Mengambil data semua barang yang tersedia dengan dukungan pencarian berdasarkan nama barang, jumlah stok, atau nama kategori. Juga mendukung pagination.
 *     tags: [Barang]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Nomor halaman, default 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Jumlah data per halaman, default 10
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Kata kunci pencarian (nama barang, jumlah stok, atau nama kategori)
 *     responses:
 *       200:
 *         description: Daftar barang berhasil diambil
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
 *                   example: Berhasil mengambil data barang
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Item'
 *                 total:
 *                   type: integer
 *                   example: 25
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 totalPages:
 *                   type: integer
 *                   example: 3
 */
router.get("/", itemController.getAll);

/**
 * @swagger
 * /api/item/{id}:
 *   get:
 *     summary: Ambil detail data barang berdasarkan ID
 *     description: Mengambil data lengkap dari satu barang berdasarkan ID, termasuk informasi kategori dan URL gambar cover.
 *     tags: [Barang]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID barang yang ingin diambil
 *     responses:
 *       200:
 *         description: Data barang berhasil ditemukan
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
 *                   example: Data barang ditemukan
 *                 data:
 *                   $ref: '#/components/schemas/Item'
 *       404:
 *         description: Barang tidak ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Barang tidak ditemukan
 */
router.get("/:id", itemController.getById);

/**
 * @swagger
 * /api/item:
 *   post:
 *     summary: Tambah data barang
 *     tags: [Barang]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               nama:
 *                 type: string
 *               stok:
 *                 type: integer
 *               kategoriId:
 *                 type: integer
 *               cover:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Barang berhasil ditambahkan
 */
router.post("/", upload.single("cover"), itemValidation, itemController.create);

/**
 * @swagger
 * /api/item/{id}:
 *   put:
 *     summary: Update data barang
 *     tags: [Barang]
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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               nama:
 *                 type: string
 *               stok:
 *                 type: integer
 *               kategoriId:
 *                 type: integer
 *               cover:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Barang berhasil diupdate
 *       404:
 *         description: Barang tidak ditemukan
 */
router.put(
  "/:id",
  upload.single("cover"),
  itemValidation,
  itemController.update
);

/**
 * @swagger
 * /api/item/{id}:
 *   delete:
 *     summary: Hapus data barang
 *     tags: [Barang]
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
 *         description: Barang berhasil dihapus
 *       404:
 *         description: Barang tidak ditemukan
 */
router.delete("/:id", itemController.remove);

module.exports = router;
