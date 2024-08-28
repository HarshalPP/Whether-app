const student = require("../Models/student")

exports.createToken = async (user, statusCode, res) => {
    try {
      const token = await user.getSignedToken();

      const cookieExpiresInDays = parseInt(process.env.COOKIE_EXPIRES_IN, 10);
      const cookieOptions = {
        expires: new Date(Date.now() + cookieExpiresInDays * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };

      res.cookie('token', token, cookieOptions);
  
      const updateStudent = await student.findByIdAndUpdate(user._id, {
        activeToken: token
      }, {
        new: true
      });
  
      user.password = undefined; // Exclude password from response
  
      res.status(statusCode).json({
        success: true,
        user,
        statusCode
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        error: 'An error occurred while sending the token.',
      });
    }
  };