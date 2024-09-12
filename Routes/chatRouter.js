const express= require("express")
const router = express.Router()
const{createCompletion}=require("../Controller/openaiController")
const{searchWithOpenAI}=require("../Controller/openaiController")

router.post("/openai",createCompletion)
router.post("/search" , searchWithOpenAI)


module.exports = router