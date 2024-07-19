const express = require('express')
const router = express.Router()
const{SendSms,makecall} = require("../Controller/twilloController")

// Make a api to send a SMS

router.post("/sendsms" , SendSms )
router.post("/call",makecall)


module.exports = router