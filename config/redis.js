// Import the Redis client
const { createClient } = require('redis');
require('dotenv').config(); // Load environment variables from .env file

// Create a Redis client using environment variables
const client = createClient({
  url: process.env.REDIS_URL, // Ensure this URL is correctly set on Vercel
  socket: {
    connectTimeout: 100000, // Increase the connection timeout if needed
  },
});

// Handle Redis connection errors
client.on('error', (err) => {
  console.error('Redis error:', err);
});

// Log successful connection
client.on('connect', () => {
  console.log('Redis is connected');
});

// Connect the client
client.connect();

// Export the client for use in other parts of your application
module.exports = client;
