const express = require("express");
const router = express.Router();
const itemController = require("../controllers/item.controller");
const { itemValidation } = require("../validation/item.validation");
const authMiddleware = require("../middlewares/auth.middleware");
const uploadImage = require("../middlewares/upload.image.middleware");
const uploadXls = require("../middlewares/upload.xls.middleware");

router.use(authMiddleware);

router.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

/**
 * @swagger
 * tags:
 *   name: Barang
 *   description: Manajemen data barang
 */

/**
 * @swagger
 * /api/item/export/status/{jobId}:
 *   get:
 *     summary: Cek status job ekspor berdasarkan ID
 *     tags: [Barang]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID dari job ekspor
 *     responses:
 *       200:
 *         description: Status job berhasil diambil
 *       404:
 *         description: Job tidak ditemukan
 */
router.get("/export/status/:jobId", itemController.checkExportStatus);

/**
 * @swagger
 * /api/item/export:
 *   get:
 *     summary: Ekspor data barang ke file Excel
 *     tags: [Barang]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Kata kunci pencarian berdasarkan nama barang
 *       - in: query
 *         name: kategori
 *         schema:
 *           type: string
 *         description: Nama kategori barang
 *       - in: query
 *         name: stok
 *         schema:
 *           type: integer
 *         description: Filter berdasarkan jumlah stok
 *     responses:
 *       200:
 *         description: Job background ekspor berhasil dibuat
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 jobId:
 *                   type: string
 *       500:
 *         description: Terjadi kesalahan saat memulai job ekspor
 */
router.get("/export", itemController.queueExport);

/**
 * @swagger
 * /api/item/import:
 *   post:
 *     summary: Impor data barang dari file Excel
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
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Job background impor berhasil dibuat
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 jobId:
 *                   type: string
 *       400:
 *         description: Validasi atau format file salah
 *       500:
 *         description: Terjadi kesalahan saat memulai job impor
 */
router.post("/import", uploadXls.single("file"), itemController.queueImport);

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
router.post(
  "/",
  uploadImage.single("cover"),
  itemValidation,
  itemController.create
);

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
  uploadImage.single("cover"),
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
