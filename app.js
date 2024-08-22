const express = require('express');
const path = require('path'); // Importar path para manejar rutas de archivos
const connectDB = require('./db');
const cors = require('cors');
const app = express();

// Conectar a MongoDB
connectDB();

// Middleware
app.use(cors()); // Agregar CORS
app.use(express.json());

// Servir la carpeta 'uploads' de manera estática
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rutas
app.use('/api/auth', require('./js/routes/auth'));
app.use('/api/products', require('./js/routes/products'));
app.use('/api/stats', require('./js/routes/stats'));
app.use('/api/favorites', require('./js/routes/favorites'));
app.use('/api/sales', require('./js/routes/sales'));

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
