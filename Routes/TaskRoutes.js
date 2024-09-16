const express = require('express')

const router = express.Router()
const {TaskCreater,Taskget,Taskdelete,UpdateTask,TaskgetwithFilter}= require("../Controller/TaskController")


router.post("/create" , TaskCreater)
router.get("/get" , Taskget )
router.delete("/delete/:id", Taskdelete)
router.put("/Update/:id", UpdateTask)
router.get("/TaskFilter",TaskgetwithFilter)


module.exports = router