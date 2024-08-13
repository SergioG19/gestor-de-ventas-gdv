const express = require('express');
const connectDB = require('./js/db');
const app = express();

// Conectar a MongoDB
connectDB();

// Middleware
app.use(express.json());

// Rutas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/products', require('./routes/products'));

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});


