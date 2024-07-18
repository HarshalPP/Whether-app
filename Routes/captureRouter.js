const express = require('express')
const router = express.Router()
const {getCaptcha,verifyCaptcha,getRendoomnumber} = require("../Controller/capture")

router.get('/captchadata', getCaptcha);
router.post('/verifydata', verifyCaptcha);
router.get("/RendomNumber", getRendoomnumber)

module.exports = router;