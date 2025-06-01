require("dotenv").config();

const fs = require("fs");
const path = require("path");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const multer = require("multer");

const app = express();
const baseUrl = process.env.BASE_URL || "http://localhost:3000";
const basePort = process.env.PORT || 3000;

// === Middleware Umum ===
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// === Buat Folder Upload jika belum ada ===
const uploadPath = path.join(__dirname, "public/uploads");
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
  console.log("📂 Folder 'public/uploads/' dibuat otomatis.");
}

// === Serve Folder Upload secara Publik ===
// Sehingga Vue bisa akses: http://localhost:3000/uploads/namafile.jpg
app.use("/uploads", express.static(uploadPath));

// === Swagger Setup ===
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Inventaris Barang API",
      version: "1.0.0",
      description: "Dokumentasi REST API untuk Inventaris Barang",
    },
    components: {
      schemas: {
        Item: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            nama: { type: "string", example: "Barang A" },
            stok: { type: "integer", example: 100 },
            kategoriId: { type: "integer", example: 2 },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
            kategori: {
              type: "object",
              properties: {
                id: { type: "integer", example: 2 },
                nama: { type: "string", example: "Kategori 1" },
                kode: { type: "string", example: "KTG01" },
                createdAt: { type: "string", format: "date-time" },
                updatedAt: { type: "string", format: "date-time" },
              },
            },
          },
        },
        Category: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            kode: { type: "string", example: "Kode A" },
            nama: { type: "string", example: "Kategori A" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
      },
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    servers: [
      {
        url: baseUrl,
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// === ROUTES ===
app.use("/api/auth", require("./routes/auth.route"));
app.use("/api/item", require("./routes/item.route"));
app.use("/api/category", require("./routes/category.route"));

// === Error Handling Middleware ===
app.use((err, req, res, next) => {
  // ✅ Tangani error multer (validasi file, dll)
  if (err instanceof multer.MulterError || err.message.includes("Format gambar")) {
    return res.status(400).json({
      success: false,
      message: "Upload gagal",
      error: err.message,
    });
  }

  // ✅ Error umum lainnya
  return res.status(500).json({
    success: false,
    message: "Terjadi kesalahan di server",
    error: err.message,
  });
});

// === START SERVER ===
app.listen(basePort, () => {
  console.log(`✅ Server berjalan di ${baseUrl}`);
  console.log(`📘 Swagger dokumentasi: ${baseUrl}/api-docs`);
});
