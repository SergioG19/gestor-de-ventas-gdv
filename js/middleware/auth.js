const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware para verificar el token JWT
module.exports = function(req, res, next) {
    const token = req.header('x-auth-token');
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, 'secret'); // Asegúrate de usar una clave segura en producción
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

// Middleware para verificar el rol de seller
module.exports.isSeller = async function(req, res, next) {
    try {
        const user = await User.findById(req.user.id);
        if (user.role !== 'seller') {
            return res.status(403).json({ msg: 'Access denied: Sellers only' });
        }
        next();
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
};