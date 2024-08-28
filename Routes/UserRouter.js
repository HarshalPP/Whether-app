const express = require('express');
const router = express.Router();

const { getUsers, createUser ,exportExcel,uploadFile,upload } = require('../Controller/User');


router.post('/create', createUser);
router.get('/get', getUsers);
router.get('/export', exportExcel);
router.post('/upload', upload.single('file') , uploadFile);


module.exports = router;