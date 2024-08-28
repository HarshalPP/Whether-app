const { localsName } = require("ejs");
const Employee= require("../Models/Employee")
const Translation = require('../Models/Translation');
const i18n = require('i18n');

// Create a Emaplyee list


exports.createEmployee = async (req, res) => {
    try {
        const { Name, Unit, locales = ['en', 'hi'] } = req.body; // Support multiple locales

        // Create a new employee
        const employee = new Employee({ Name, Unit });
        const result = await employee.save();

        // Prepare translations for each locale
        const translations = [];
        locales.forEach(locale => {
            translations.push(
                { key: `employee.name.${result._id}`, locale, value: Name },
                { key: `employee.unit.${result._id}`, locale, value: Unit }
            );
        });

        // Save or update translations for each locale
        for (const { key, locale, value } of translations) {
            await Translation.findOneAndUpdate(
                { key, locale },
                { value },
                { upsert: true, new: true }
            );
        }

        res.status(201).json({
            message: 'Employee created successfully',
            data: result
        });

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};


// Get the Emplyee List


const getTranslation = async (key, locale) => {
    const translation = await Translation.findOne({ key, locale });
    return translation ? translation.value : key; // Return key if translation not found
};


exports.getEmployee = async (req, res) => {
    try {
        const locale = req.query.locale || 'en'; // Default to 'en'
        i18n.setLocale(locale);
        const employees = await Employee.find({});

        // Fetch translations for each employee
        const employeesWithTranslations = await Promise.all(employees.map(async (employee) => {
            const nameTranslation = await getTranslation(`employee.name.${employee._id}`, locale);
            const unitTranslation = await getTranslation(`employee.unit.${employee._id}`, locale);

            return {
                ...employee.toObject(),
                Name: nameTranslation,
                Unit: unitTranslation
            };
        }));



        res.status(200).json({
            message: true,
            data: employeesWithTranslations,

        });

    } catch (error) {
        console.error('Error fetching employees:', error);
        res.status(500).json({
            error: error.message
        });
    }
};



