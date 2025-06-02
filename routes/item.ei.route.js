const express = require("express");
const router = express.Router();
const itemController = require("../controllers/item.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const uploadXls = require("../middlewares/upload.xls.middleware");

router.use(authMiddleware);

router.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

/**
 * @swagger
 * tags:
 *   name: Export Import Barang
 *   description: EI data barang
 */

/**
 * @swagger
 * /api/item-ei/export/status/{jobId}:
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
 * /api/item-ei/export:
 *   post:
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
router.post("/export", itemController.queueExport);

/**
 * @swagger
 * /api/item-ei/import:
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

module.exports = router;
