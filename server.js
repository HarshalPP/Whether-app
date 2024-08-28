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
const cookieParser = require('cookie-parser');
const i18n = require("./config/i18Config")
const translationMiddleware =require("./Middleware/Transltion_middleware")
const app = express();

 



// Load environment variables
dotenv.config();

const connectDB = require('./config/db');
const router = require('./Route'); // Ensure your route file is named correctly
const { SuperfaceClient } = require('@superfaceai/one-sdk');



// cookies middleware

app.use(cookieParser());


// Proxy configuration for secure cookies
app.set('trust proxy', true);

// Create HTTP server and attach Socket.io
const server = http.createServer(app);
const io = socketIo(server);

// Configure Peer.js server
const peerServer = ExpressPeerServer(server, {
    debug: true,
});
app.use('/peerjs', peerServer);

// Handle Socket.io connections
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('join-room', (roomId, userId) => {
        socket.join(roomId);
        console.log(`User ${userId} joined room ${roomId}`);
        socket.to(roomId).broadcast.emit('user-connected', userId);

        socket.on('disconnect', () => {
            console.log('User disconnected:', userId);
            socket.to(roomId).broadcast.emit('user-disconnected', userId);
        });
    });
});

// Use i18n middleware
// Use i18n middleware
app.use(i18n.init);


app.get('/greet', (req, res) => {
    res.send(i18n.__('greeting'));
});


app.use((req, res, next) => {
    const lang = req.query.lang || req.headers['accept-language'];
    console.log(`Requested language: ${lang}`);
    if (lang && i18n.getLocales().includes(lang)) {
        i18n.setLocale(req, lang);
    }
    console.log(`Current locale: ${i18n.getLocale(req)}`);
    next();
});


// Middleware to set the locale from the query parameter or header
// Use translation middleware
app.use(translationMiddleware);

// Middleware and static files setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// Session setup
app.use(session({
    secret: 'keyboardcat',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
        httpOnly: true, // Prevent client-side JavaScript from accessing the cookie
        maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
}));

// Middleware setup
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(requestIp.mw());

// Routes
app.get('/', (req, res) => {
    res.send('API is running');
});
app.use('/api/v1/', router);


// Start server and connect to database
const PORT = process.env.PORT || 5000;

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
