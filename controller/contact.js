const ActiveProducts = require("../model/activeProductModel")
const Querry = require("../model/querriesModel")
const jwt = require("jsonwebtoken")
const jwtSecretKey= process.env.JWT_SECRET_KEY
const emailCheck = require("../middleware/nodemailer")

exports.querry = async (req, res) => {
    console.log(req.body, "at contact")

  
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
//email, subject, text,html

exports.complaint = async (req, res) => {
    console.log("you reached")

    const id = req.params.id
    let product = await ActiveProducts.findById(id, {
        title: 1,
        category: 1,
        condition: 1,
        quantity: 1,
        color: 1,
        price: 1,
        description: 1,
        creator: 1,
        views: 1,
        images: 1
    })
    .populate([{path:"creator",select:"firstName", model:User}])
    .populate()

    if (!product) res.json({ status: "failed", message: "No such product found" })
    else {
        const token = req.header("x-auth-token")
        if(!token){
            product.favorit=false
            res.json({success:product})
            }
            else
                try{
                    jwt.verify(token, jwtSecretKey,async(fail, decodedPayload)=>{
                        if(fail){  
                            product.favorit=false
                            res.json({failed:"Authentication failed not"})
                            }
                            else await User.findById(decodedPayload.id,{liked:1},(err,doc)=>{
                                if(err) res.json({failed:err})
                                    else {
                                        if(doc.liked.includes(id)) {
                                            res.json({success:product, favorit:true})
                                            }
                                            else{
                                                res.json({success:product,favorit:false})
                                                }
                                    }
                            })
                        
                    })
                } 
                catch(error){
                    res.json({
                        status:"failed",
                        message:error
                    }) 
            }

    }

}