const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
    try {
      // Check if the authorization header is present
      if (!req.headers.authorization) {
        return res.status(403).json({ message: "Forbidden: No token provided!" });
      }
  
      // Extract the token from the authorization header
      const token = req.headers.authorization;
      console.log("token" , token)
  
      // Check if the token exists after splitting
      if (!token) {
        return res.status(403).json({ message: "Forbidden: Malformed token!" });
      }
  
      // Verify the token using the secret key
      const payload = await jwt.verify(token, process.env.JWT_SECRET || 'MYKEY');

      console.log("payload is", payload)
  
      // Attach the payload to the request object for later use
      req.payload = payload;
  
      // Proceed to the next middleware
      next();
    } catch (err) {
      // Handle specific JWT errors for better clarity
      let message = "Forbidden 🚫🚫🚫";
      if (err.name === "TokenExpiredError") {
        message = "Token expired. Please log in again.";
      } else if (err.name === "JsonWebTokenError") {
        message = "Invalid token. Authorization denied.";
      }
  
      // Send the error response
      res.status(401).json({ message });
    }
  };