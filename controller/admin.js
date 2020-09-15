const Querry = require("../model/querriesModel")
const User=require("../model/userModel")
const Complaints=require("../model/reportModel")
const ActiveProducts = require("../model/activeProductModel")
const AllProducts = require("../model/allProductModel")
const BlockedProduct=require("../model/blockedProductModel")

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
    Complaints.find({},{_id:1, productId:1, title:1, creatorId:1, timeStamp:1, completed:1, message:1},(err, doc) => {
        if (err) res.json({ status: "failed", message: err })
        else {
            console.log(doc)
            res.send({
                success: doc
            })
        }
    })
    
}

exports.blockProduct = async (req, res) => {
    
    await ActiveProducts.findOne({_id:req.body.data.id},(err,result)=>{
        if(err) return res.json({failed:"Sorry! your request is failed"})
        if(result){
            result.remove()
            result=result.toObject()
            result.active=false
            result.blocked=true
            let swap = new BlockedProduct(result)
            swap.save()
            AllProducts.findOneAndUpdate({refId:req.body.data.id},{blocked:true},async (err, doc)=>{
                if(err) res.send({failed:err})
                    else res.json({success:"You ghave Successfully blocked the product"})
            })
        }
        
    })
}
    exports.activeProducts = async (req, res) => {
                AllProducts.find({active:true},{_id:1, title:1, creator:1, timeStamp:1, category:1, active:1, blocked:1, sold:1, deleted:1, refId:1},(err, doc) => {
                    if (err) res.json({ status: "failed", message: err })
                    else {
                        res.send({
                            success: doc
                        })
                    }
                })
            
        }

    exports.blockedProducts = async (req, res) => {
        AllProducts.find({blocked:true},{_id:1, title:1, creator:1, timeStamp:1, category:1, active:1, blocked:1, sold:1, deleted:1, refId:1},(err, doc) => {
                if (err) res.json({ status: "failed", message: err })
                else {
                    res.send({
                        success: doc
                    })
                }
            })
        
    }

    exports.deletedProducts = async (req, res) => {
        AllProducts.find({deleted:true},{_id:1, title:1, creator:1, timeStamp:1, category:1, active:1, blocked:1, sold:1, deleted:1, refId:1},(err, doc) => {
            if (err) res.json({ status: "failed", message: err })
            else {
                res.send({
                    success: doc
                })
            }
        })
    
}

exports.soldProducts = async (req, res) => {
    AllProducts.find({sold:true},{_id:1, title:1, creator:1, timeStamp:1, category:1, active:1, blocked:1, sold:1, deleted:1, refId:1},(err, doc) => {
        if (err) res.json({ status: "failed", message: err })
        else {
            res.send({
                success: doc
            })
        }
    })

}

exports.inactiveProducts = async (req, res) => {
    AllProducts.find({active:false, blocked:false, deleted:false, sold:false},{_id:1, title:1, creator:1, timeStamp:1, category:1, active:1, blocked:1, sold:1, deleted:1, refId:1},(err, doc) => {
        if (err) res.json({ status: "failed", message: err })
        else {
            res.send({
                success: doc
            })
        }
    })
}

exports.allProducts = async (req, res) => {
    AllProducts.find({},{_id:1, title:1, creator:1, timeStamp:1, category:1, active:1, deleted:1, blocked:1, sold:1, refId:1},(err, doc) => {
        if (err) res.json({ status: "failed", message: err })
        else {

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