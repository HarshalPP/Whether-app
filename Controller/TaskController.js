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



exports.Taskdelete = async(req,res)=>{
    try{
        const {id}=req.params
        const Findtask = await Task.findById(id)

        if(!Findtask){
            return  res.status(404).json('Task is not found to delete')
        }

        const deleteTask = await Task.findByIdAndDelete(id)
        return res.status(200).json({
            Task:deleteTask
        })
    }
    catch(error){
     return res.status(500).json('Internal Server error')
    }
}