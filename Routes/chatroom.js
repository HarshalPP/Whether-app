const express=require('express')
const router=express.Router()
const auth=require("../Middleware/auth")


const {createChatroom,getAllChatrooms}=require("../Controller/chatroomController")


router.post("/", auth , createChatroom);
router.get("/", auth , getAllChatrooms);

module.exports=router;