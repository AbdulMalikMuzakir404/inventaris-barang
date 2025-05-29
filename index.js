require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// === SWAGGER SETUP ===
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const baseUrl = process.env.BASE_URL;
const basePort = process.env.PORT;

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
            createdAt: {
              type: "string",
              format: "date-time",
              example: "2025-05-28T05:57:38.000Z",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              example: "2025-05-28T05:57:38.000Z",
            },
            kategori: {
              type: "object",
              properties: {
                id: { type: "integer", example: 2 },
                nama: { type: "string", example: "Kategori 1" },
                kode: { type: "string", example: "KTG01" },
                createdAt: {
                  type: "string",
                  format: "date-time",
                  example: "2025-05-28T05:38:20.000Z",
                },
                updatedAt: {
                  type: "string",
                  format: "date-time",
                  example: "2025-05-28T05:38:20.000Z",
                },
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
            createdAt: {
              type: "string",
              format: "date-time",
              example: "2025-05-28T05:38:20.000Z",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              example: "2025-05-28T05:57:38.000Z",
            },
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
        url: baseUrl || "https://inventaris.diwirain.my.id",
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// === ROUTES ===
/** Auth */
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);
/** Item */
const itemRoutes = require("./routes/item");
app.use("/api/item", itemRoutes);
/** Category */
const categoryRoutes = require("./routes/category");
app.use("/api/category", categoryRoutes);

// === START SERVER ===
app.listen(basePort || 3000, () => {
  console.log(
    `Server berjalan di ${baseUrl || "localhost"}:${basePort || 3000}`
  );
  console.log(
    `Swagger dokumentasi: ${baseUrl || "localhost"}:${
      basePort || 3000
    }/api-docs`
  );
});
