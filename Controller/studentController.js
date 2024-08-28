const { compare } = require("bcrypt");
const student= require("../Models/student")
const {createToken} = require("../Utils/jwt")
const bcrypt = require('bcryptjs')

// To show the Node-Cron // 
// var cron = require('node-cron');

// cron.schedule('*/2 * * * *', () => {
//   console.log('running a task every two minutes');
// });

// Sign up the Student

exports.Register = async (req, res) => {
    const { Name, Email, password } = req.body;
  
    console.log(Name, Email, password);
  
    try {
      // Check if all fields are provided
      if (!Name || !Email || !password) {
        return res.status(400).json({
          status: 'fail',
          message: 'Please provide Name, Email, and password correctly.'
        });
      }
  
      // Check if user already exists
      const existingUser = await student.findOne({ Email });
      if (existingUser) {
        return res.status(400).json({
          status: 'fail',
          message: 'Email already exists, please use a different Email.'
        });
      }
  
      // Create new user
      const newUser = await student.create({ Name, Email, password });
  
      // Send token
      createToken(newUser, 201, res);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: 'error',
        message: 'Internal Server Error',
        error: error.message
      });
    }
  };



  exports.login = async(req,res)=>{
    const {Email,password}=req.body

    try{

      if(!Email || !password){
        return res.status(400).json({
          status:'fail',
          message:'Please Provide the Email and Password'
        })
      }

      const user = await student.findOne({Email}).select('+passoword')
      if(!user){
        return res.status(401).json({
          status:'fail',
          message:'User is Not Defined'
        })
      }
      if(password){
      const comparerdPassword = await bcrypt.compare(password , user.password)
      if(comparerdPassword===false){
       return res.status(400).json({
          message:'Password is not correct'
        })
      }
      }
      createToken(user,200,res)
    }catch(error){
      console.error(error);
     return res.status(500).json({
        status: 'error',
        message: 'Internal Server Error',
        error: error.message,
      });
    }
  }



  // Forgot the Password


  exports.ForgotPassword = async(req,res)=>{
    try{

      const {Email}=req.body

      // checked the Email is Exist ot not

      const checkedEmail = await student.findOne({Email})
      // if Email is not exist then, throw the errror

      if(!checkedEmail){
        res.status(400).json({
          msg:'Email is not exist'
        })
      }

      // if Email is Found so, we will Generate the token

      const resetToken = await checkedEmail.createPasswordResetToken()

      console.log("Reset Token is", resetToken )

      await checkedEmail.save({ validateBeforeSave: false })

      res.status(200).json({
        msg:'Password Reset Request has been send'
      })


    }catch(error){

      res.status(500).json({
        msg:'Internel server error',
        error:error
      })

    }
  }


  // Reset Token

  //1. take a token in params , and take a expiretd data should be geter then date.now()
  //2. then we took the password from the body , then hash then password and save in the database 
  //3. Send a mail to user , Password is set successfully


  exports.resetPassword = async (req, res, next) => {
    try {
        const { resetToken } = req.params;

        // Find the data
        const FindResetToken = await student.findOne({
            passwordResetToken: resetToken,
            passwordResetExpires: { $gt: Date.now() }
        });

        if (!FindResetToken) {
            return res.status(400).json({
                message: 'Invalid Reset token'
            });
        }

        const { password } = req.body;

        if (!password) {
            return res.status(400).json({
                msg: 'Please provide the password'
            });
        }

        // Assuming passwords are hashed, we can't compare plaintext directly
        // Therefore, compare hashes if you're using a hashing mechanism like bcrypt
        const isSamePassword = await bcrypt.compare(password, FindResetToken.password);
        
        if (isSamePassword) {
            return res.status(400).json({
                msg: 'Use a different password, this is your current password'
            });
        }

        // Assuming you're using a hashing mechanism like bcrypt
        const hashedPassword = await bcrypt.hash(password, 10);
        FindResetToken.password = hashedPassword;
        FindResetToken.passwordResetToken = undefined;
        FindResetToken.passwordResetExpires = undefined;

        await FindResetToken.save();
        return res.status(200).json({
            success: true,
            msg: "Password reset successfully"
        });
    } catch (error) {
        return res.status(500).json({
            msg: 'Internal server error',
            error: error.message // Only include the message of the error
        });
    }
}



// Update Password 
/**
 * 1. Take a password and confirm password
 * 2. Match both password and Confitma password
 * 3. if both are matched , then we can hash the password and update the code
 */

exports.UpdatePassword = async (req, res) => {
  try {
    // Check if user is authenticated and available in req.user
    const user = req.user;
    if (!user) {
      return res.status(401).json({
        msg: 'Unauthorized'
      });
    }

    // Get the new password from the request body
    const { Password, confirmPassword } = req.body;

    if (!Password || !confirmPassword) {
      return res.status(400).json({
        msg: 'Please provide both password and confirm password'
      });
    }

    if (Password !== confirmPassword) {
      return res.status(400).json({
        msg: 'Password and confirm password do not match'
      });
    }

    // Find the user by ID
    const foundUser = await student.findById(req.user._id);

    if (!foundUser) {
      return res.status(404).json({
        msg: 'User not found'
      });
    }

    // Update the user's password
    foundUser.password = Password;  


    // Save the updated user document
    await foundUser.save();



    return res.status(200).json({
      success: true,
      msg: 'Password updated successfully'
    });
  } catch (error) {
    return res.status(500).json({
      msg: 'Internal Server Error',
      error: error.message
    });
  }
};

