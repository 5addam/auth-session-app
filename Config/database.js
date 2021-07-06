const mongoose = require('mongoose');
require('dotenv').config()

/**
 * ---------- SET-UP - MONGODB ---------------
 */
// var mongoDB =  `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@cluster0.fykun.mongodb.net/inventory_db?retryWrites=true&w=majority`
mongoose.connect(process.env.DB_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const connection = mongoose.connection;
connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Expose the connection
module.exports = connection;