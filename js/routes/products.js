const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Configuración de multer para manejar la subida de imágenes
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Crear un producto
router.post('/', auth, upload.single('image'), async (req, res) => {
  const { name, price, description, category } = req.body;
  const vendor = req.user.id;

  try {
    if (!name || !description || !price || !category) {
      return res.status(400).json({ errors: [{ msg: 'Por favor completa todos los campos requeridos' }] });
    }

    const newProduct = new Product({
      name,
      price,
      description,
      category,
      vendor,
      image: req.file ? req.file.path : '' // Guarda la ruta de la imagen si se ha subido una
    });

    const product = await newProduct.save();
    res.json(product);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ errors: [{ msg: 'Server error' }] });
  }
});

// Ruta para obtener todos los productos
router.get('/', auth, async (req, res) => {
    try {
        const products = await Product.find().populate('vendor', 'name email');
        res.json(products);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;