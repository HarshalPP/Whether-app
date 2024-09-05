const router=require("express").Router()
const{register,login}=require("../Controller/userController")

router.post("/login" , login)
router.post("/register",register)


module.exports=router;