const express = require('express')
const router = express.Router()
const{Register,login,ForgotPassword,resetPassword,UpdatePassword} = require("../Controller/studentController")
const{AuthorizationMiddleware}=require("../Middleware/AuthorizationMiddleware")

// Make a Router to show the API

router.post("/Register",  Register)
router.post("/login" , login)
router.post("/ForgotPassword", ForgotPassword)
router.post('/resettoken/:resetToken', resetPassword)
router.put('/updatepassword', AuthorizationMiddleware , UpdatePassword)


module.exports = router;