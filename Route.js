const express = require('express');
const app = express();
const storeRouter = require('./Routes/storeRouter');
const userRouter = require('./Routes/UserRouter');
const CaptureRouter =require("./Routes/captureRouter")
const whetherRouter = require("./Routes/whetherRouter")

// Store Router
app.use('/store', storeRouter);
app.use('/user', userRouter);
app.use('/capture', CaptureRouter)
app.use('/Whether' , whetherRouter )


// 



module.exports = app;