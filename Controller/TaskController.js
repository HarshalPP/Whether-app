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



exports.UpdateTask = async (req, res) => {
    try {
      const { id } = req.params;
      const { Title, Type } = req.body;
  
      // Find and update the task
      const updatedTask = await Task.findByIdAndUpdate(
        id,
        { Title, Type },
        { new: true, runValidators: true } // Return the updated document and run validators
      );
  
      // Check if the task was found and updated
      if (!updatedTask) {
        return res.status(404).json({ message: 'Task not found or not updated' });
      }
  
      // Success response
      return res.status(200).json({
        message: 'Task updated successfully',
        data: updatedTask,
      });
    } catch (error) {
      // Catch server errors
      console.error('Error updating task:', error);
      return res.status(500).json({ error: error.message });
    }
  };
  

  exports.TaskgetwithFilter = async (req, res) => {
    try {
      let In_Progress = [];
      let To_do = [];
      let Completed = [];
  
      // Fetch all tasks
      const finddata = await Task.find({});
  
      if (!finddata || finddata.length === 0) {
        return res.status(404).json({ message: "No tasks found" });
      }
  
      // Loop through the tasks and categorize based on their type
      finddata.forEach(task => {
        if (task.Type === 'Completed') {
          Completed.push(task);
        } else if (task.Type === 'In-Progress') {
          In_Progress.push(task);
        } else if (task.Type === 'To-do') {
          To_do.push(task);
        }
      });
  
      // Return the filtered data
      return res.status(200).json({
        Completed,
        In_Progress,
        To_do
      });
  
    } catch (error) {
      return res.status(500).json({
        error: error.message
      });
    }
  };
  