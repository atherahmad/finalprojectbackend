const User= require("../model/userModel")

exports.myAccount=async(req,res)=>{

    await User.findById(req.userId, (err, doc)=>{
        if(err) return res.json({status:"failed", message:"Unable to retrieve your data please try again"})
        res.json({status:"success", message:"You have been authorized", data:doc})

    })
    
}