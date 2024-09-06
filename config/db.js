const mongoose = require('mongoose');
const dotenv = require('dotenv');

const data = process.env.MONGO_URI;

const connectDB = async () => {
try{
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
}catch(err){
    console.error(err);
    process.exit(1);
}
}

module.exports = connectDB;