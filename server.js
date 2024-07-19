const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { ExpressPeerServer } = require('peer');
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

const peerServer = ExpressPeerServer(server, {
    debug: true,
});

app.use('/peerjs', peerServer);

// socket Connection
// Socket.io connection
io.on('connection', socket => {
    socket.on('join-room', (roomId, userId) => {
        socket.join(roomId);
        socket.to(roomId).emit('user-connected', userId);

        socket.on('disconnect', () => {
            socket.to(roomId).emit('user-disconnected', userId);
        });
    });
});

// Static Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

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

app.get("/" , (req,res)=>{
    res.send('Api is Running ')
})

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
