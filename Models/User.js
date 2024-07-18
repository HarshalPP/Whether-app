const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const storeSchema = new Schema({
    name: {
        type: String,

    },
    lastname: {
        type: String,

    }
});
module.exports = mongoose.model('UserDemis', storeSchema);