const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { isVendor } = require('../middleware/auth');
const Product = require('../models/Product');

// Ruta para añadir un producto
router.post('/', auth, isVendor, async (req, res) => {
    const { name, description, price } = req.body;
    
    try {
        const newProduct = new Product({
            name,
            description,
            price,
            vendor: req.user.id
        });

        const product = await newProduct.save();
        res.json(product);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Ruta para obtener todos los productos
router.get('/', async (req, res) => {  // Nota: Eliminé el middleware `auth` para permitir el acceso público a los productos
    try {
        const products = await Product.find().populate('vendor', 'name email');
        res.json(products);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
