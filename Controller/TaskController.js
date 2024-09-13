const Task = require("../Models/Task")


// Create the Task //


exports.TaskCreater = async(req,res)=>{

    try{

        const {Title,Type}=req.body

        const Taskdata = new Task({
            Title,
            Type
        })

        const result = await Taskdata.save();
        res.status(201).json({
            data:result
        })

    }catch(error){
        res.status(500).json({error:error.messsage})
    }
}


exports.Taskget = async(req,res)=>{
    try{
        const finddata = await Task.find({})
        if(!finddata){
            res.status(200).json({})
        }
        res.status(200).json({
            data:finddata
        })
    }catch(error){
        res.status(500).json({
            error:error.message
        })
    }
}