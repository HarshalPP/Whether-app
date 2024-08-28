const mongoose =require('mongoose')

const EmployeeSchema = mongoose.Schema({
    Name:{
        type:String,

    },

    Unit:{
        type:String
    }
},{
    timestamps:true
})


module.exports= mongoose.model('Employee',EmployeeSchema)