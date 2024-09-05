const mongoose = require("mongoose");
const Chatroom=require("../Models/Chatroom")

// Create a new chatroom
exports.createChatroom = async (req, res) => {
  const { name } = req.body;

  // Regex to allow only alphabets and spaces
  const nameRegex = /^[A-Za-z\s]+$/;

  try {
    // Validate the chatroom name
    if (!nameRegex.test(name)) {
      return res.status(400).json({ error: "Chatroom name can contain only alphabets and spaces." });
    }

    // Check if the chatroom already exists
    const chatroomExists = await Chatroom.findOne({ name });
    if (chatroomExists) {
      return res.status(400).json({ error: "Chatroom with that name already exists!" });
    }

    // Create and save the new chatroom
    const chatroom = new Chatroom({ name });
    await chatroom.save();

    // Send success response
    res.status(201).json({ message: "Chatroom created successfully!" , chatroom});
  } catch (error) {
    // Handle unexpected errors
    console.error("Error creating chatroom:", error);
    res.status(500).json({ error: "An unexpected error occurred while creating the chatroom." });
  }
};

// Get all chatrooms
exports.getAllChatrooms = async (req, res) => {
  try {
    // Retrieve all chatrooms from the database
    const chatrooms = await Chatroom.find({});
    
    // Send chatrooms as a response
    res.status(200).json(chatrooms);
  } catch (error) {
    // Handle unexpected errors
    console.error("Error retrieving chatrooms:", error);
    res.status(500).json({ error: "An unexpected error occurred while retrieving chatrooms." });
  }
};
