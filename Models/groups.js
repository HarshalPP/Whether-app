const mongoose = require('mongoose')

const groupSchema = new mongoose.Schema({

    name:{
        type:String
    },

    members:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }],
    
    createdAt:{
        type:Date,
        default:Data.now()
    }
})



module.exports = mongoose.model('Group', groupSchema);  