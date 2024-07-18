const express = require('express')
const router = express.Router()
const {IpAddress , WhetherIp} = require("../Controller/whetherController")

router.get("/", IpAddress)
router.get("/Wethetemp", WhetherIp)

module.exports = router