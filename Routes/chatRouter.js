const express= require("express")
const router = express.Router()
const{createCompletion}=require("../Controller/openaiController")

router.post("/openai",createCompletion)


module.exports = router