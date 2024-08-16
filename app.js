const express = require('express');
const connectDB = require('./db');
const cors = require('cors');
const app = express();

// Conectar a MongoDB
connectDB();

// Middleware
app.use(cors()); // Agregar CORS
app.use(express.json());

// Rutas
app.use('/api/auth', require('./js/routes/auth'));
app.use('/api/products', require('./js/routes/products'));
app.use('/api/stats', require('./js/routes/stats'));

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});