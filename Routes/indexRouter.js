const express=require("express")

const router = express.Router()
const{indexejs}=require("../Controller/RocketreactController")

router.get("/index", indexejs )
module.exports=router