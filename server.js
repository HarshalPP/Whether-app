const express = require('express');
const http = require('http');
const { ExpressPeerServer } = require('peer');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const requestIp = require('request-ip');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken'); // Ensure jwt is imported
const i18n = require("./config/i18Config");
const translationMiddleware =require("./Middleware/Transltion_middleware");
const connectDB = require('./config/db');
const router = require('./Route'); // Ensure your route file is named correctly
const Message = require('./Models/Message');
const User=require("./Models/User")
const { swaggerUi, swaggerDocs } = require("./config/swaggerConfig")


dotenv.config();

const app = express();

// Cookies middleware
app.use(cookieParser());

// Proxy configuration for secure cookies
app.set('trust proxy', true);


// Session setup
app.use(session({
    secret: 'KEY-NEW', // Replace with your own secret
    resave: false,
    saveUninitialized: false, // Set to false if you don't need to save uninitialized sessions
    cookie: { 
        secure: false, // Set to true if using HTTPS
    }
}));
// Create HTTP server and attach Socket.io
const server = http.createServer(app);
const io = require("socket.io")(server, {
    allowEIO3: true,
    cors: {
        origin: true,
        methods: ['GET', 'POST'],
        credentials: true
    }
});

// Middleware to verify JWT and set userId on the socket
io.use(async (socket, next) => {
    try {
        const token = socket.handshake.query.token;

        if (token) {
            console.log("Received Token:", token);

            try {
                // Attempt to verify the token
                const payload = await jwt.verify(token,  process.env.JWT_SECRET || 'MYKEY');
                socket.userId = payload.id;
                console.log("User authenticated with ID:", socket.userId);
            } catch (verifyError) {
                // Log the error if token verification fails, but don't block the connection
                console.warn("Token verification failed:", verifyError.message);
            }
        } else {
            console.log("No token provided, proceeding without authentication.");
        }

        // Proceed to the next middleware or connection handler
        next();
    } catch (err) {
        console.error("Middleware error:", err.message);
        next(); // Allow the connection to proceed even if an unexpected error occurs
    }
});


// Handle Socket.io connections
// io.on('connection', (socket) => {
//     console.log(`User connected: ${socket.userId} with socket ID: ${socket.id}`);

//     // Handle user disconnection
//     socket.on("disconnect", () => {
//         console.log(`User disconnected: ${socket.userId} with socket ID: ${socket.id}`);
//     });

//     // Example: Handle custom events from the client
//     socket.on('custom-event', (data) => {
//         console.log(`Custom event received from ${socket.userId}:`, data);
//         // Do something with the received data
//     });
// });


io.on('connection', (socket) => {
console.log("connected", +socket.userId)


socket.on("disconnect",()=>{
    console.log("Disconnected: " + socket.userId);
})

socket.on("joinRoom", ({ chatroomId }) => {
    socket.join(chatroomId);
    console.log("A user joined chatroom: " + chatroomId);
  });

  socket.on("leaveRoom", ({ chatroomId }) => {
    socket.leave(chatroomId);
    console.log("A user left chatroom: " + chatroomId);
  });

  socket.on("chatroomMessage", async({chatroomId,message})=>{
    if(message.trim().lenght > 0){
        const user= await User.findOne({_id:socket.userId});
        const newMessage= new Message({
            chatroom:chatroomId,
            user:socket.userId,
            message,
        })
    

    io.to(chatroomId).emit("newMessage",{
        message,
        name:user.name,
        userId:socket.userId,
      });
      await newMessage.save()
    }
  });

  




})

// Configure Peer.js server
const peerServer = ExpressPeerServer(server, {
    debug: true,
});
app.use('/peerjs', peerServer);

// Use i18n middleware
app.use(i18n.init);

// Example greeting route with i18n
app.get('/greet', (req, res) => {
    res.send(i18n.__('greeting'));
});

// Middleware to set the locale from query parameter or header
app.use((req, res, next) => {
    const lang = req.query.lang || req.headers['accept-language'];
    console.log(`Requested language: ${lang}`);
    if (lang && i18n.getLocales().includes(lang)) {
        i18n.setLocale(req, lang);
    }
    next();
});

// Use translation middleware
app.use(translationMiddleware);

// Middleware and static files setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));



// Middleware setup
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(requestIp.mw());
// Serve Swagger Docs


// Routes
app.get('/', (req, res) => {
    res.send('API is running');
});
app.use('/api/v1/', router);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Start server and connect to database
const PORT = process.env.PORT || 5000;

connectDB()
    .then(() => {
        console.log('Database connected');
        server.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
            console.log('Swagger Docs are available at https://whether-app-woad.vercel.app/api-docs');
        });
    })
    .catch((error) => {
        console.error('Database connection failed:', error);
        process.exit(1); // Exit the process with failure
    });
