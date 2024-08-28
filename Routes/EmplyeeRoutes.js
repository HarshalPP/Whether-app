const express = require('express')
const router = express.Router()
const {createEmployee,getEmployee} =require("../Controller/EmplyeeController")

router.post("/create",createEmployee )
router.get("/get",getEmployee)


module.exports = router;