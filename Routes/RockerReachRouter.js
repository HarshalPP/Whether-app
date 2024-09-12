const express=require("express")
const router = express.Router()
const {getPerson,exportSessionData} = require("../Controller/RocketreactController")


router.get('/lookup', getPerson);
router.get("/export", exportSessionData)

module.exports=router