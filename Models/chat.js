const mongoose = require("mongoose")

const chatschema = new mongoose.Schema({

    group:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Group'
    },

    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },

    message:{
        type:String,
        required:true
    },
    
    createdAt:{
        type:Date,
        default:Data.now()
    }
})


module.exports = mongoose.model('chat' , chatschema )