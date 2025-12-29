const mongoose = require('mongoose');
const Paste = require('../models/Paste');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pastebin-lite');
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

// Connect immediately when this module is loaded (or call this in index.js)
// For simplicity, we'll export a connect function and call it in index.js, 
// but we can also start connection here.
// Let's rely on index.js calling connectDB, or just connect here if env is ready.
// Given the previous structure, let's export connectDB and call it.

const savePaste = async (pasteData) => {
    const paste = new Paste(pasteData);
    await paste.save();
};

const getPaste = async (id) => {
    const paste = await Paste.findOne({ id });
    return paste ? paste.toObject() : null;
};

const updatePaste = async (pasteData) => {
    // We need to update the existing document
    await Paste.findOneAndUpdate({ id: pasteData.id }, pasteData);
};

const healthCheck = async () => {
    return mongoose.connection.readyState === 1;
};

module.exports = {
    connectDB,
    savePaste,
    getPaste,
    updatePaste,
    healthCheck
};

