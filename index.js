const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// === SWAGGER SETUP ===
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Inventaris Barang API',
      version: '1.0.0',
      description: 'Dokumentasi REST API untuk Inventaris Barang',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
  },
  apis: ['./routes/*.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// === ROUTES ===
/** Item */
const itemRoutes = require('./routes/item');
app.use('/api/item', itemRoutes);
/** Category */
const categoryRoutes = require('./routes/category');
app.use('/api/category', categoryRoutes);

// === START SERVER ===
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
  console.log(`Swagger dokumentasi: http://localhost:${PORT}/api-docs`);
});
