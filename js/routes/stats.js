const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Purchase = require('../models/purchase');
const auth = require('../middleware/auth');

// Obtener estadísticas específicas del vendedor
router.get('/', auth, async (req, res) => {
  try {
    const sellerId = req.user.id;

    // Contar los productos que ha creado el vendedor
    const totalProducts = await Product.countDocuments({ seller: sellerId });

    // Contar los productos vendidos
    const totalSold = await Purchase.countDocuments({ seller: sellerId });

    // Contar los compradores únicos
    const uniqueBuyers = await Purchase.distinct('buyer', { seller: sellerId });
    const totalBuyers = uniqueBuyers.length;

    res.json({
      totalProducts,
      totalSold,
      totalBuyers
    });
  } catch (err) {
    console.error('Error al obtener estadísticas:', err.message);
    res.status(500).send('Error en el servidor');
  }
});

module.exports = router;
