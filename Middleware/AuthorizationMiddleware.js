const student = require('../Models/student');
const jwt = require('jsonwebtoken')
exports.AuthorizationMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({
                message: "Unauthorized1"
            });
        }

        const token = authHeader.split(' ')[1];
        console.log(token, "token---------->>>>>>>>");

        if (!token || token === "") {
            return res.status(401).json({
                message: "Unauthorized2"
            });
        }

        // Verify token
        jwt.verify(token, process.env.JWT_SECRETS, async (err, decodedData) => {
            if (err) {
                return res.status(401).json({
                    message: "Unauthorized3"
                });
            }

            try {
                req.user = await student.findOne({ id: decodedData?._id });
                next();
            } catch (error) {
                return res.status(500).json({
                    message: "Internal Server Error",
                    msg:error.message
                });
            }
        });
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            msg:error.message
        });
    }
};
// Make a Middleware to check if the user is an admin or not

exports.AuthorizationRole=(...roles)=>{
    return (req,res,next)=>{
        if(!roles.includes(req.user.role)){
            res.status(403).json({
                message: "Forbidden"
            });
        }
        next();
    }
}

