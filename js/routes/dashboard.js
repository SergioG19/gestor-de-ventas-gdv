const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { isVendor } = require('../middleware/auth');

// Ruta del dashboard del vendedor
router.get('/', auth, isVendor, (req, res) => {
    res.send('Welcome to the Vendor Dashboard');
});

module.exports = router;
