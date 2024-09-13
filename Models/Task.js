const mongoose = require("mongoose")

const TaskSchema = mongoose.Schema({

Title:{
 type:String,
},
Type:{
 type:String,
 enum:['To-do' ,'In-Progress' , 'Completed']
}
},{
    timestamps:true
})


module.exports = mongoose.model('Task', TaskSchema)