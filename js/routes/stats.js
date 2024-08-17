// Archivo: routes/stats.js
const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const auth = require('../middleware/auth');

// Obtener estadísticas específicas del vendedor
router.get('/', auth, async (req, res) => {
  try {
    // Obtener el ID del vendedor autenticado
    const sellerId = req.user.id;

    // Contar los productos que ha creado el vendedor
    const totalProducts = await Product.countDocuments({ seller: sellerId });

    // Contar cuántos de estos productos han sido vendidos (asume que hay un campo "sold" en el modelo)
    const totalSold = await Product.countDocuments({ seller: sellerId, sold: true });

    res.json({
      totalProducts,
      totalSold,
      totalBuyers: 0 // Placeholder para futuros datos
    });
  } catch (err) {
    console.error('Error al obtener estadísticas:', err.message);
    res.status(500).send('Error en el servidor');
  }
});

module.exports = router;
