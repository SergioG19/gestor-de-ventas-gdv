// Archivo: routes/products.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { isSeller } = require('../middleware/auth');
const Product = require('../models/Product');

// Ruta para añadir un producto
router.post('/', auth, isSeller, async (req, res) => {
    const { name, description, price, category } = req.body;
    
    try {
        const newProduct = new Product({
          name,
          price,
          description,
          category,
          seller: req.user.id  // Usar el ID del usuario autenticado como el 'seller'
        });

        const product = await newProduct.save();
        res.json(product);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Ruta para obtener todos los productos
router.get('/all', async (req, res) => {
  try {
      const products = await Product.find().populate('seller', 'name email');
      res.json(products);
  } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
  }
});

// Ruta para obtener los productos del vendedor autenticado
router.get('/', auth, async (req, res) => {
  try {
      const products = await Product.find({ seller: req.user.id }).populate('seller', 'name email');
      res.json(products);
  } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
  }
});


// Ruta para editar un producto
router.put('/:id', auth, isSeller, async (req, res) => {
    const { name, description, price, category } = req.body;

    try {
        let product = await Product.findById(req.params.id);
        
        if (!product) {
            return res.status(404).json({ msg: 'Producto no encontrado' });
        }

        // Verificar que el producto pertenece al vendedor que intenta editarlo
        if (product.seller.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'No autorizado para editar este producto' });
        }

        // Actualizar los campos del producto
        product.name = name || product.name;
        product.description = description || product.description;
        product.price = price || product.price;
        product.category = category || product.category;

        product = await product.save();
        res.json(product);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Ruta para eliminar un producto
router.delete('/:id', auth, isSeller, async (req, res) => {
    try {
        let product = await Product.findById(req.params.id);
        
        if (!product) {
            return res.status(404).json({ msg: 'Producto no encontrado' });
        }

        // Verificar que el producto pertenece al vendedor que intenta eliminarlo
        if (product.seller.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'No autorizado para eliminar este producto' });
        }

        await product.remove();
        res.json({ msg: 'Producto eliminado' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
