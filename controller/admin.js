const Querry = require("../model/querriesModel")
const User=require("../model/userModel")
const Complaints=require("../model/reportModel")
const ActiveProducts = require("../model/activeProductModel")
const AllProducts = require("../model/allProductModel")
const BlockedProducts=require("../model/blockedProductModel")
const emailCheck = require("../middleware/nodemailer")


exports.querriesList = async (req, res) => {

        Querry.find({},{_id:1, name:1, subject:1, completed:1, timeStamp:1},(err, doc) => {
            if (err) res.json({ status: "failed", message: err })
            else {
                res.send({
                    success: doc
                })
            }
        })
}

exports.querryDetails =async(req,res)=>{
    Querry.findById(req.params.id,(err, doc) => {
        if (err) res.json({ status: "failed", message: err })
        else {
            res.send({
                success: doc
            })
        }
    })

}

exports.querryHandler=async(req,res)=>{
    
    const {id,  response, email, name,subject} =req.body
    let querry = await emailCheck.confirmation({
        email:email,
        subject:`RE: ${req.body.subject}`,
        text:"",
        html:`
            Dear ${name}
            <h2>Thanks for Contacting us!</h2>
            <p>${response}</p>
            <br/>
            ==========================================================================
            <br/>
            Your querry
            <h4>Subject: ${subject}</h4>
            <h4>Message:</h4>
            <p>${req.body.messageText}</p>`
    })
    if(querry) Querry.findByIdAndUpdate(id,{completed:true, response:response} ,(err,doc)=>{
        if(err) res.json({failed:"Your request is failed please try again"})
            else res.json({success: doc})

    }) 
        else res.json({status:"failed", message:"Sorry we are unable to proccess your request please try again later"})
}

exports.usersList = async (req, res) => {
    User.find({},{_id:1, firstName:1, lastName:1, admin:1, email:1},(err, doc) => {
        if (err) res.json({ status: "failed", message: err })
        else {
            res.send({
                success: doc
            })
        }
    })

}


exports.complaintsList = async (req, res) => {
    Complaints.find({},{_id:1, productId:1, title:1,  timeStamp:1, completed:1, valid:1},(err, doc) => {
        if (err) res.json({ status: "failed", message: err })
        else {
            console.log(doc)
            res.send({
                success: doc
            })
        }
    })
    
}

exports.complainDetails=async(req,res)=>{
    Complaints.findById(req.params.id,(err,doc)=>{
        if(err) res.json({failed:"Sorry your request failed"})
            else res.json({success:doc})
    })
}

exports.blockProduct = async (req, res) => {
    console.log(req.body.id, "comoing from block req")+

    await AllProducts.findById(req.body.id, {refId:1}, async (err,doc)=>{

        if(err) res.json({failed:"request failed"})

            else await ActiveProducts.findById(doc.refId,(err,result)=>{
                if(err) return res.json({failed:"Sorry! your request is failed"})
                    else console.log(result)
                if(result){
        
        
                    result.remove()
                    result=result.toObject()
                    result.active=false
                    result.blocked=true
                    let swap = new BlockedProducts(result)
                    swap.save()
                    AllProducts.findByIdAndUpdate(req.body.id,{blocked:true, active:false},async (err, doc)=>{
                        if(err) res.send({failed:err})
                            else res.json({success:"You ghave Successfully blocked the product"})
                    })
                }
                
            })
    })


}
    exports.activeProducts = async (req, res) => {
                AllProducts.find({active:true},{_id:1, title:1, creator:1, timeStamp:1,  active:1, blocked:1, sold:1, deleted:1, refId:1},(err, doc) => {
                    if (err) res.json({ failed: err })
                    else {
                        res.send({
                            success: doc
                        })
                    }
                })
            
        }

    exports.blockedProducts = async (req, res) => {
        AllProducts.find({blocked:true},{_id:1, title:1, creator:1, timeStamp:1,  active:1, blocked:1, sold:1, deleted:1,refId:1},(err, doc) => {
                if (err) res.json({ failed: err })
                else {
                    res.send({
                        success: doc
                    })
                }
            })
        
    }

    exports.deletedProducts = async (req, res) => {
        AllProducts.find({deleted:true},{_id:1, title:1, creator:1, timeStamp:1, active:1, blocked:1, sold:1, deleted:1, refId:1},(err, doc) => {
            if (err) res.json({ failed: err })
            else {
                res.send({
                    success: doc
                })
            }
        })
    
}

exports.soldProducts = async (req, res) => {
    AllProducts.find({sold:true},{_id:1, title:1, creator:1, timeStamp:1, active:1, blocked:1, sold:1, deleted:1, refId:1},(err, doc) => {
        if (err) res.json({ failed: err })
        else {
            res.send({
                success: doc
            })
        }
    })

}

exports.inactiveProducts = async (req, res) => {
    AllProducts.find({active:false, blocked:false, deleted:false, sold:false},{_id:1, title:1, creator:1, timeStamp:1, active:1, blocked:1, sold:1, deleted:1, refId:1},(err, doc) => {
        if (err) res.json({failed: err })
        else {

            res.send({
                success: doc
            })
        }
    })
}

exports.allProducts = async (req, res) => {
    AllProducts.find({},{title:1, creator:1, timeStamp:1, category:1, active:1, deleted:1, blocked:1, sold:1, refId:1},(err, doc) => {
        if (err) res.json({ failed: err })
        else {
            doc._id=doc.refId
            res.send({
                success: doc
            })
        }
    })

}

exports.userDetails = async (req, res)=>{
    console.log(req.params.userId, "req in admin user details")
    User.findById(req.params.userId, {firstName:1, lastName:1,email:1,paypalId:1,phoneNumber:1, address:1,profileImage:1, admin:1}, (err,doc)=>{
        if (err) res.json({
            status: "failed",
            message: err
        })
        else {
            const { firstName, lastName, email, paypalId, phoneNumber, profileImage, admin } = doc
            let street, city, zipCode;
            if (doc.address) {
                street = doc.address.street;
                city = doc.address.city;
                zipCode = doc.address.zipCode
            }
            else {
                street = ""
                city = ""
                zipCode = ""
            }
            const profile = { firstName, lastName, email, paypalId, phoneNumber, street, city, zipCode, profileImage, admin }
            res.json({
                status: "success",
                data: profile
            })

        }
    })
}

exports.updateUser=async (req,res)=>{

    User.findByIdAndUpdate(req.body.userId, {admin:req.body.admin}, (err,doc)=>{
        if(err) res.json({failed:"request failed try again"})
            else res.json({success:"You have updated user Access"})
    })
}

exports.searchProduct=async(req,res)=>{

    console.log(req.body.id, req.body.type, "req.body.")
    if(req.body.type==="allproducts")

        AllProducts.findOne({refId:req.body.id}
                            ,{_id:1, title:1, creator:1, timeStamp:1, category:1, active:1, deleted:1, blocked:1, sold:1, refId:1},(err,doc)=>{
    	    if(err) res.json({failed:"Request failed please try again"})
    	        else res.json({success:doc})
        })
        else if(req.body.type==="inactive")
                AllProducts.findOne({refId:req.body.id, active:false, blocked:false, deleted:false, sold:false}
                             ,{_id:1, title:1, creator:1, timeStamp:1, category:1, active:1, deleted:1, blocked:1, sold:1, refId:1}
                            ,(err,doc)=>{
    	                        if(err) res.json({failed:"Request failed please try again"})
    	                            else res.json({success:doc})
                })
            else AllProducts.findOne({refId:req.body.id, [req.body.type]:true}
                ,{_id:1, title:1, creator:1, timeStamp:1, category:1, active:1, deleted:1, blocked:1, sold:1, refId:1}
               ,(err,doc)=>{
                   if(err) res.json({failed:"Request failed please try again"})
                       else res.json({success:doc})})


}

exports.productDetails=async(req,res)=>{
    console.log(req.params.id, "in prog details")
    AllProducts.findOne({_id:req.params.id},{
        title: 1,
        price: 1,
        description: 1,
        creator: 1,
        images: 1,
        active:1,
        refId:1,
        blocked:1
    },
    (err,doc)=>{
        if(err) res.json({failed:"Request failed try again "})
            else {
                console.log(doc)
                res.json({success:doc})}
    } 
    )

}

exports.complainHandler=async(req,res)=>{
    const {id, remarks, response} = req.body

    Complaints.findByIdAndUpdate(id, {remarks, valid:response==="1"?true:false, completed:true}, (err,doc)=>{
        if(err) res.json({failed:"Request failed please try again"})
            else res.json({success:"You have successfully submitted the complain solution"})
    })
}