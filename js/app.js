const express = require('express');
const connectDB = require('./db');
const app = express();

// Conectar a MongoDB
connectDB();

// Middleware
app.use(express.json());

// Rutas
app.use('/api/auth', require('./routes/auth'));

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
