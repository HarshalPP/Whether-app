const i18n = require('i18n');
const Translation = require('../Models/Translation'); // Path to your Translation model

// Configure i18n
 i18n.configure({
    queryParameter: 'lang',
    locales: ['en', 'hi'], // List of supported locales
    defaultLocale: 'en',
    autoReload: true,
    syncFiles: true,
    directory: __dirname + '/../locales', // Directory for locale files (if you use them)
    updateFiles: false, // If true, it will update the locale files (only relevant if `directory` is used)
    // Custom loader function to fetch translations from the database
    loadLocale: async (locale) => {
        console.log(locale)
        try {
            const translations = await Translation.find({ locale });
            const translationMap = {};

            translations.forEach((translation) => {
                translationMap[translation.key] = translation.value;
            });

            return translationMap;
        } catch (error) {
            console.error(`Error loading locale ${locale}:`, error);
            return {}; // Return an empty object on error to prevent crashes
        }
    },
    // Optional: Log information for debugging
    logDebugFn: function (msg) {
        console.debug(msg , "1");
    },
    logWarnFn: function (msg) {
        console.warn(msg , "2");
    },
    logErrorFn: function (msg) {
        console.error(msg , "3");
    }
});

module.exports = i18n;
