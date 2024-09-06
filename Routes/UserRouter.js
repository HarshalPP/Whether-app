const express = require('express');
const router = express.Router();


const { getUsers, createUser ,exportExcel,uploadFile,upload } = require('../Controller/User');


// /**
//  * @swagger
//  * tags:
//  *  name: USER-PROFILE
//  *  description: User Info .
//  */

/**
 * @swagger
 * /api/v1/user/create:
 *   post:
 *     summary: Create a new user
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: First name of the user
 *                 example: John
 *               lastname:
 *                 type: string
 *                 description: Last name of the user
 *                 example: Doe
 *     responses:
 *       201:
 *         description: Successfully created a new user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: User ID
 *                 name:
 *                   type: string
 *                   description: First name of the user
 *                 lastname:
 *                   type: string
 *                   description: Last name of the user
 *       500:
 *         description: Server error
 */

router.post('/create', createUser);


/**
 * @swagger
 * /api/v1/user/get:
 *   get:
 *     summary: Fetch user data
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: Successfully fetched user data
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: User ID
 *                   name:
 *                     type: string
 *                     description: User name
 *                   email:
 *                     type: string
 *                     description: User email
 */

router.get('/get', getUsers);





router.get('/export', exportExcel);
router.post('/upload', upload.single('file') , uploadFile);


module.exports = router;