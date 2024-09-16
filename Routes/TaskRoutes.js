const express = require('express')

const router = express.Router()
const {TaskCreater,Taskget,Taskdelete,UpdateTask}= require("../Controller/TaskController")


router.post("/create" , TaskCreater)
router.get("/get" , Taskget )
router.delete("/delete/:id", Taskdelete)
router.put("/Update/:id", UpdateTask)


module.exports = router