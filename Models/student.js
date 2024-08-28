const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
require('dotenv').config()


// Define the Schema

const StudentSchema = new mongoose.Schema({

    Name: {
        type: String,
        require: [true, 'Please Provide the Name']
    },

    password: {
        type: String,
        required: [true, 'Please Provide the Password']
    },

    Email: {
        type: String,
        required: [true, 'Please Provide the Email'],
        unique: true

    },
    role:{
        type:String,
        enum:['Student' , 'Parent'],
        default:'Student'

    },

   activeToken: {
      type: String
    },

    passwordChangeAt:Date,
    passwordResetToken:String,
    passwordResetExpires: Date,
}, {
    timestapms: true
})

// Define the Doucment Middleware

StudentSchema.pre('save', async function (next) {
    if (!this.isModified('password'))
        return next()
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt)
    next();
})


// Compare the Password
StudentSchema.methods.matchPasswords = async function(password){
    return await bcrypt.compare(password,this.password)
}


StudentSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
      const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
      return JWTTimestamp < changedTimestamp;
    }
  
    // False means NOT changed
    return false;
  };

  

// Generate the Password
StudentSchema.methods.getSignedToken=async function(){
    const payload = {
        id:this.id,
        role:this.role
    }
    return  jwt.sign(payload, process.env.JWT_SECRETS,{
        expiresIn: process.env.JWT_EXPIRE,
    })
}


StudentSchema.methods.createPasswordResetToken =async function(){
    let resetToken = crypto.randomBytes(32).toString('hex')
    this.passwordResetToken=resetToken
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes from now
    return resetToken
}


const student = mongoose.model('Student',StudentSchema )
module.exports = student


