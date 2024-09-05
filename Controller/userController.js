const mongoose=require("mongoose")
const User=require("../Models/User")
const sha265=require("js-sha256")
const jwt = require("jsonwebtoken");
const bcrypt=require('bcrypt')




// Register function
exports.register = async (req, res) => {
    const { name, email, password } = req.body;

    // Email regex to validate allowed domains
    const emailRegex = /@gmail.com|@yahoo.com|@hotmail.com|@live.com/;

    try {
        // Validate email domain
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: "Email is not supported from your domain." });
        }

        // Validate password length
        if (password.length < 6) {
            return res.status(400).json({ error: "Password must be at least 6 characters long." });
        }

        // Check if the user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ error: "User with the same email already exists." });
        }

        // Hash the password with bcrypt
        const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

        // Create new user
        const user = new User({
            name,
            email,
            password: hashedPassword,
        });

        // Save user to the database
        await user.save();

        // Send success response
        res.status(201).json({
            message: `User [${name}] registered successfully!`,
        });
    } catch (error) {
        // Handle any other unexpected errors
        console.error("Registration error:", error);
        res.status(500).json({ error: "An unexpected error occurred during registration." });
    }
};

// Login function
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Validate input
        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required." });
        }

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: "Email and password do not match." });
        }

        // Compare password with the stored hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Email and password do not match." });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'MYKEY', {
            expiresIn: '1d', // Set token expiration time as needed
        });

        // Send success response with token
        res.status(200).json({
            message: "User logged in successfully!",
            token,
        });
    } catch (error) {
        // Handle any unexpected errors
        console.error("Login error:", error);
        res.status(500).json({ error: "An unexpected error occurred during login." });
    }
};