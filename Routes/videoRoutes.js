const express = require('express');
const router = express.Router();
const{getHome,getRoom} =  require("../Controller/videocallController")
 
router.get('/', getHome );
router.get('/:room', getRoom);

module.exports = router;
