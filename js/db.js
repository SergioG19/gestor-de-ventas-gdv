const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://sergioghimlee:UtWDwwJjcF7A3D3@clustersergio.2ldqz.mongodb.net/?retryWrites=true&w=majority&appName=Clustersergio', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

module.exports = connectDB;
