const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    image: {
        type: String, // Ruta de la imagen almacenada
    },
    category: {
        type: String,
        required: true,
        enum: ['Electrodomésticos', 'Tecnología', 'Supermercado']
    },
    seller: {  
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    quantity: {
        type: Number,
        required: true, // Hacemos que la cantidad sea obligatoria
        default: 1     // Valor por defecto de 1
    }
});

module.exports = mongoose.model('Product', ProductSchema);
