// routes/sales.js

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Purchase = require('../models/purchase');

// Ruta para obtener el historial de ventas del vendedor autenticado
router.get('/', auth, async (req, res) => {
  try {
    const sellerId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = 6; // Limitar el número de ventas por página

    // Obtener las ventas del vendedor autenticado
    const sales = await Purchase.find({ seller: sellerId })
      .populate('product')
      .populate('buyer')
      .skip((page - 1) * limit)
      .limit(limit);

    // Contar el total de ventas del vendedor para la paginación
    const totalSales = await Purchase.countDocuments({ seller: sellerId });
    const totalPages = Math.ceil(totalSales / limit);

    res.json({ sales, totalPages });
  } catch (err) {
    console.error('Error fetching sales:', err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
