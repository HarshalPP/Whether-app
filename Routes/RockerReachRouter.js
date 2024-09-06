const express=require("express")
const router = express.Router()
const {getPerson} = require("../Controller/RocketreactController")


router.get('/lookup', getPerson);

module.exports=router