const express = require('express');
const app = express();
const storeRouter = require('./Routes/storeRouter');
const userRouter = require('./Routes/UserRouter');
const CaptureRouter =require("./Routes/captureRouter")
const whetherRouter = require("./Routes/whetherRouter")
const SmsRouter = require("./Routes/TwiloRouter")
const videoRouter = require("./Routes/videoRoutes")
const StudentRouter = require("./Routes/StudentRouter")
const OpenAIRouter = require("./Routes/chatRouter")
const EmplyeeRouter =require("./Routes/EmplyeeRoutes")


// Store Router
app.use('/store', storeRouter);
app.use('/user', userRouter);
app.use('/capture', CaptureRouter)
app.use('/Whether' , whetherRouter )
app.use('/Twillo' , SmsRouter)
app.use('/Video' , videoRouter)
app.use('/Student', StudentRouter)
app.use('/ai', OpenAIRouter)
app.use("/Emplyee",EmplyeeRouter)

// 

module.exports = app;