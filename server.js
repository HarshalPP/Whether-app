const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const requestIp = require('request-ip');

// Load environment variables
dotenv.config();

const connectDB = require('./config/db');
const router = require("./Route")
const { SuperfaceClient } = require('@superfaceai/one-sdk');
const app = express();

// Proxy
app.set('trust proxy', true);

// socket config 
const server = http.createServer(app);
const io = socketIo(server);

// socket Connection
io.on('connection', (socket) => {
    console.log('New client connected');

    socket.emit('welcome', 'Welcome to the chat!');

    socket.on('joinGroup', (groupId) => {
        socket.join(groupId);
        console.log(`Client joined group: ${groupId}`);
    });

    socket.on('chatMessage', (msg) => {
        io.to(msg.groupId).emit('chatMessage', msg);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

// Static Middleware
app.use(express.static(path.join(__dirname, 'Frontend')));

// Session setup
app.use(session({
    secret: 'keyboardcat',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
        httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
        maxAge: 1000 * 60 * 60 * 24, // 1 day
    }
}));

// Middleware setup
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(requestIp.mw());

// Routes setup
app.use('/api/v1/', router);

const PORT = process.env.PORT || 5000;

// Connect to the database
connectDB()
    .then(() => {
        console.log('Database connected');
        server.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Database connection failed:', error);
        process.exit(1); // Exit the process with failure
    });
