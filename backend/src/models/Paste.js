const mongoose = require('mongoose');

const pasteSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true, index: true },
    content: { type: String, required: true },
    createdAt: { type: Number, required: true },
    expiresAt: { type: Number, default: null },
    maxViews: { type: Number, default: null },
    viewCount: { type: Number, default: 0 }
});

module.exports = mongoose.model('Paste', pasteSchema);
