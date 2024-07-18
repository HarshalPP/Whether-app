
exports.AuthorizationMiddleware = (req, res, next) => {
    try{

       const authHeader = req.headers.authorization;
       if(!authHeader){
              res.status(401).json({
                message: "Unauthorized"
              });
       }

       const token = authHeader.split(' ')[1];

       if(!token || token === ""){
              res.status(401).json({
                message: "Unauthorized"
              });
       }

       // verify token

       jwt.verify(token , process.env.JWT_SECRET , (err,decode)=>{
        if(err){
            res.status(401).json({
                message: "Unauthorized"
            });
        }
        req.user = decode;
        next();
       } )


    }catch(err){
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
}


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

