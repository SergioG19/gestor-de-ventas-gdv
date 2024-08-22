const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Favorite = require('../models/Favorite'); // Modelo de favoritos

// Obtener todos los favoritos del usuario autenticado
router.get('/', auth, async (req, res) => {
  try {
    const favorites = await Favorite.find({ user: req.user.id }).populate('product');
    res.json(favorites);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Agregar un producto a favoritos
router.post('/', auth, async (req, res) => {
  const { productId } = req.body;

  try {
    let favorite = await Favorite.findOne({ user: req.user.id, product: productId });

    // Si el producto ya está en favoritos, devuelve el favorito existente
    if (favorite) {
      return res.status(200).json(favorite);
    }

    // Si no está en favoritos, crea uno nuevo
    favorite = new Favorite({
      user: req.user.id,
      product: productId,
    });

    await favorite.save();
    res.json(favorite);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Eliminar un producto de favoritos
router.delete('/:id', auth, async (req, res) => {
  try {
      console.log('ID recibido para eliminar:', req.params.id);
      const favorite = await Favorite.findById(req.params.id);

      if (!favorite) {
          return res.status(404).json({ msg: 'Favorito no encontrado' });
      }

      // Verificar si el usuario es el propietario del favorito
      if (favorite.user.toString() !== req.user.id) {
          return res.status(401).json({ msg: 'No autorizado' });
      }

      // Usar findByIdAndDelete en lugar de remove
      await Favorite.findByIdAndDelete(req.params.id);
      
      res.json({ msg: 'Producto eliminado de favoritos' });
  } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
  }
});

module.exports = router;
