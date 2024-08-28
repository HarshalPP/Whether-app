const i18n = require('i18n');
const Translation = require('../Models/Translation');

module.exports = async (req, res, next) => {
    const locale = req.query.lang || req.headers['accept-language'] || 'en';

    try {
        // Fetch translations from the database
        const translations = await Translation.find({ locale });
        const translationMap = translations.reduce((acc, { key, value }) => {
            acc[key] = value;
            return acc;
        }, {});

        // Configure i18n with dynamic translations
        i18n.configure({
            locales: [locale],
            directory: __dirname + '/../locales',
            defaultLocale: 'en',
            updateFiles: false,
            syncFiles: false,
            api: {
                __: 'translate',
                __n: 'translateN',
            }
        });

        i18n.setLocale(locale);
        req.__ = i18n.__; // Make the translation function available in the request

    } catch (error) {
        console.error('Error loading translations:', error);
    }

    next();
};
