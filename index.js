require('dotenv').config();

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

const baseUrl = process.env.BASE_URL
const basePort = process.env.PORT

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
        url: 'https://inventaris.diwirain.my.id',
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
app.listen(basePort || 3000, () => {
  console.log(`Server berjalan di ${baseUrl || 'localhost'}:${basePort || 3000}`);
  console.log(`Swagger dokumentasi: ${baseUrl || 'localhost'}:${basePort || 3000}/api-docs`);
});
