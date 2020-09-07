const User= require("../model/userModel")
const bcrypt =require("bcryptjs")
const jwt = require("jsonwebtoken")
const emailCheck = require("../middleware/nodemailer")
const PassRecovery = require("../model/passRecoveryModel")

//Password Recovery Token
const passResetToken = (payload,pass) =>jwt.sign(payload, pass, {expiresIn:3600})

//Reseting Passowrd and Sending Link

exports.resetLink = async(req,res)=>{
    const {email} =req.body.data
    let userCheck= await User.findOne({email})
    if(!userCheck) return res.json({status:"failed", message:"Invalid email address"})

    const payload ={
        id:userCheck._id,
        email:userCheck.email
    }

    const resetToken = await passResetToken(payload, userCheck.pass)
    const newPassRcovery= new PassRecovery({
        userId : userCheck._id,
        recovered:false,
        requestTimeStamp:Date.now(),
        tokenId:resetToken,
        previousPass:userCheck.pass

    });
    newPassRcovery.save(async (err, doc)=>{
        if(err) res.json({status: "failed", message:err})
        else{ 
            let resetLinkSent = await emailCheck.confirmation({
                id:userCheck._id,
                email:userCheck.email,
                subject:"Reset Password at c2c",
                text:"",
                html:`<b>To Change your passowrd please <a href="http://localhost:3000/resetpass/${payload.id}/${resetToken}">Click here!</a></b>`
            })
            if(resetLinkSent) res.json({status:"success", message:"Email containg reset link successfuly sent. Please check your email."})
                else res.json({status:"failed", message:"Sorry we are unable to proccess your request please try again later"})
        }
    })    
}

exports.recoverPassword = async(req,res)=>{
    const {token} = req.body.data
    let tokenCheck= await PassRecovery.findOne({tokenId:token})
    if(!tokenCheck) return res.json({status:"failed", message:"invalid token"})
    if(tokenCheck.recovered) return res.json({status:"failed", message:"invalid token"})
        else res.json({
            status   :"success",
            message  : "Valid Request ", 
            token    
             })
   
    }



exports.resetPassword=async(req,res)=>{
    const {pass,confirmPass} = req.body.data
    const token = req.header("x-auth-token")
    const id = req.params.id

    if(!token) return res.json({
        status:"failed",
        message:"Authentication failed!"})
    
    if(pass!==confirmPass) return res.json({status:"failed", message:"Passwords mismatch please check your inputs"})
    
    let targetUser = await User.findById(id)

    if(!targetUser) return res.json({status:"failed", message:"Authentication failed"})

    const jwtPassKey = targetUser.pass
    
    try{
        jwt.verify(token, jwtPassKey,(fail, decodedPayload)=>{
            if(fail) return res.json({
                status:"failed",
                message:"Authentication failed! in jwt part"
            }) 
            else {
                console.log("its payload", decodedPayload)
               
            }
        })
    } catch(error){
        res.status(500).json({
            status:"error",
            message:error
        })
    }

    let hashedPass = await bcrypt.hash(pass, 10)
    const profileData = {
        pass:hashedPass
    }

    await User.findByIdAndUpdate(id, profileData,async (err, doc)=>{
        if(err) return res.json({status:"failed", message:err})
        else {

            await PassRecovery.findOneAndUpdate({tokenId:token}, {recovered:true}, (err,doc)=>{
                if(err) res.json({status:"failed", message:err})
                    else res.json({status:"success", message:"You have succesfully cahnged your password"})
            })
        }

     })
}
