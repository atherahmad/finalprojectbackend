const Querry = require("../model/querriesModel")
const Complaint=require("../model/reportModel")
const emailCheck = require("../middleware/nodemailer")

exports.querry = async (req, res) => {

        const newQuerry = new Querry({
            name:req.body.name,
            email:req.body.email,
            subject:req.body.subject,
            message:req.body.messageText,
            completed:false})
            
        await newQuerry.save(async(err,doc)=>{
            if(err) {
                res.json({status:"failed", message:"Currently unable to send your meesage please try again", data:err})
                throw err
            }
            else {
                                    



    let resetLinkSent = await emailCheck.confirmation({
        email:req.body.email,
        subject:req.body.subject,
        text:"",
        html:`
            <h2>Thanks for Contacting us!</h2>
            <h4>Our team will contact you in next 48 hours regarding your querry.</h4>
            <br/>
            ==========================================================================
            <br/>
            Your querry
            <h4>Subject: ${req.body.subject}</h4>
            <h4>Message:</h4>
            <p>${req.body.messageText}</p>`
    })
    if(resetLinkSent) res.json({success: "We have recieved your querry"})
        else res.json({status:"failed", message:"Sorry we are unable to proccess your request please try again later"})}

})
}

exports.report = async (req, res) => {

    const newComplaint = new Complaint({
        productId:req.body.productId,
        creatorId:req.body.creatorId,
        title:req.body.title,
        message:req.body.message,
        completed:false})

        await newComplaint.save(async(err,doc)=>{
            if(err) {
                res.json({status:"failed", message:"Currently unable to process your request please try again", data:err})
                throw err
            }
            else 
            res.send({success:"We recieved your complaint and will act accordingly"})
        })
        
}