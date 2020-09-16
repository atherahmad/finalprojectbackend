const jwt = require("jsonwebtoken")
const jwtSecretKey= process.env.ADMIN_JWT_SECRET_KEY

exports.adminAuthCheck =(req,res, next)=>{
    const token = req.header("x-auth-token")

    if(!token) return res.json({
        status:"failed",
        message:"Authentication failed!"})
    
    try{
        jwt.verify(token, jwtSecretKey,(fail, decodedPayload)=>{
            if(fail) return res.json({
                failed:"Authentication failed!"
            }) 
            else {
                req.userId =decodedPayload.id;
                next();
            }
        })
    } catch(error){
        res.json({
            status:"failed",
            message:error
        })
    }
}