const express = require('express');
const router = express.Router();
const barangController = require('../controllers/barangController');

/**
 * @swagger
 * tags:
 *   name: Barang
 *   description: Manajemen data barang
 */

/**
 * @swagger
 * /api/barang:
 *   get:
 *     summary: Ambil semua data barang
 *     tags: [Barang]
 *     responses:
 *       200:
 *         description: Daftar barang berhasil diambil
 */
router.get('/', barangController.getAll);

/**
 * @swagger
 * /api/barang/{id}:
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
router.get('/:id', barangController.getById);

/**
 * @swagger
 * /api/barang:
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
 *               kode:
 *                 type: string
 *               jumlah:
 *                 type: integer
 *               keterangan:
 *                 type: string
 *     responses:
 *       201:
 *         description: Barang berhasil ditambahkan
 */
router.post('/', barangController.create);

/**
 * @swagger
 * /api/barang/{id}:
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
 *               kode:
 *                 type: string
 *               jumlah:
 *                 type: integer
 *               keterangan:
 *                 type: string
 *     responses:
 *       200:
 *         description: Barang berhasil diupdate
 *       404:
 *         description: Barang tidak ditemukan
 */
router.put('/:id', barangController.update);

/**
 * @swagger
 * /api/barang/{id}:
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
router.delete('/:id', barangController.remove);

module.exports = router;
