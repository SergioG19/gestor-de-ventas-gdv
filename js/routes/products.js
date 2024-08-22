const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const auth = require('../middleware/auth');
const { isSeller } = require('../middleware/auth');
const Product = require('../models/Product');
const Purchase = require('../models/purchase'); // Asegúrate de importar el modelo de Purchase

// Configuración de multer para la carga de archivos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Nombre único basado en la fecha
    }
});

const upload = multer({ storage: storage });


router.post('/', auth, isSeller, upload.single('image'), async (req, res) => {
    const { name, description, price, category, quantity } = req.body;
  
    try {
        const newProduct = new Product({
            name,
            price,
            description,
            category,
            seller: req.user.id,  // Usar el ID del usuario autenticado como el 'seller'
            image: req.file ? req.file.filename : null,  // Guardar solo el nombre del archivo de imagen
            quantity  // Añadir la cantidad al producto
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
router.put('/:id', auth, isSeller, upload.single('image'), async (req, res) => {
    const { name, description, price, category, quantity } = req.body;
  
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
        product.quantity = quantity || product.quantity;
  
        if (req.file) {
            product.image = req.file.filename; // Actualizar solo el nombre del archivo de la imagen si se cargó una nueva
        }
  
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

        await Product.deleteOne({ _id: req.params.id });
        res.json({ msg: 'Producto eliminado' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Ruta para comprar un producto
router.post('/buy', auth, async (req, res) => {
    try {
        const { productId, quantity } = req.body; // Asegúrate de recibir el campo quantity del frontend
        const buyerId = req.user.id;

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ msg: 'Producto no encontrado' });
        }

        if (product.quantity < quantity) {
            return res.status(400).json({ msg: 'Cantidad solicitada no disponible en stock' });
        }

        // Crear una nueva compra
        const purchase = new Purchase({
            buyer: buyerId,
            product: productId,
            seller: product.seller,
            quantity, // Añadir la cantidad en la compra
        });

        // Reducir la cantidad del producto solo si la compra es exitosa
        product.quantity -= quantity;
        await product.save();

        await purchase.save();

        res.json({ msg: 'Compra realizada con éxito' });
    } catch (err) {
        console.error('Error en la compra:', err.message);
        res.status(500).json({ msg: 'Error en el servidor' });
    }
});


module.exports = router;
