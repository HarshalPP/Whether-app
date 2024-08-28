const mongoose = require('mongoose');

const TranslationSchema = new mongoose.Schema({
    key: { type: String, required: true },
    locale: { type: String, required: true },
    value: { type: String, required: true }
});

module.exports = mongoose.model('Translation', TranslationSchema);
