const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Obtener estadísticas generales
router.get('/', auth, async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalSold = await Product.countDocuments({ sold: true });
    const totalBuyers = await User.countDocuments({ role: 'buyer' });

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
