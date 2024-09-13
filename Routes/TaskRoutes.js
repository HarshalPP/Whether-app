const express = require('express')

const router = express.Router()
const {TaskCreater,Taskget,Taskdelete}= require("../Controller/TaskController")


router.post("/create" , TaskCreater)
router.get("/get" , Taskget )
router.delete("/delete/:id", Taskdelete)


module.exports = router