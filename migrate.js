const mongoose = require('mongoose');
const User = require('../gestor-de-ventas-gdv/js/models/User');
const Product = require('../gestor-de-ventas-gdv/js/models/Product');

async function migrateData() {
    try {
        // Conectar a la base de datos
        await mongoose.connect('mongodb+srv://sergioghimlee:UtWDwwJjcF7A3D3@clustersergio.2ldqz.mongodb.net/gestor_de_ventas?retryWrites=true&w=majority', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log('Conectado a MongoDB para la migración.');

        // Paso 1: Migrar usuarios con rol 'vendor' a 'seller'
        const usersUpdated = await User.updateMany({ role: 'vendor' }, { role: 'seller' });
        console.log(`Usuarios migrados: ${usersUpdated.nModified}`);

        // Paso 2: Migrar productos para usar el campo 'seller' en lugar de 'vendor'
        const productsUpdated = await Product.updateMany({}, [
            { $set: { seller: "$vendor" } }, // Copiar el valor de 'vendor' a 'seller'
            { $unset: "vendor" } // Eliminar el campo 'vendor'
        ]);
        console.log(`Productos migrados: ${productsUpdated.nModified}`);

        // Desconectar de la base de datos
        await mongoose.disconnect();
        console.log('Desconectado de MongoDB. Migración completa.');
    } catch (err) {
        console.error('Error durante la migración:', err.message);
        process.exit(1);
    }
}

// Ejecutar la función de migración
migrateData();
