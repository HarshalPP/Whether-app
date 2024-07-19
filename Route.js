const express = require('express');
const app = express();
const storeRouter = require('./Routes/storeRouter');
const userRouter = require('./Routes/UserRouter');
const CaptureRouter =require("./Routes/captureRouter")
const whetherRouter = require("./Routes/whetherRouter")
const SmsRouter = require("./Routes/TwiloRouter")
const videoRouter = require("./Routes/videoRoutes")


// Store Router
app.use('/store', storeRouter);
app.use('/user', userRouter);
app.use('/capture', CaptureRouter)
app.use('/Whether' , whetherRouter )
app.use('/Twillo' , SmsRouter)
app.use('/Video' , videoRouter)


// 



module.exports = app;