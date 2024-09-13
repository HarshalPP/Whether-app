const express = require('express')

const router = express.Router()
const {TaskCreater,Taskget}= require("../Controller/TaskController")


router.post("/create" , TaskCreater)
router.get("/get" , Taskget )


module.exports = router