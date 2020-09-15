const Querry = require("../model/querriesModel")
const User=require("../model/userModel")
const Complaints=require("../model/reportModel")
const ActiveProducts = require("../model/activeProductModel")
const AllProducts = require("../model/allProductModel")
const BlockedProduct=require("../model/blockedProductModel")
const SoldProducts=require("../model/soldProductModel")
const InactiveProducts=require("../model/inactiveProductModel")
const DeletedProducts=require("../model/deletedProductModel")

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
//email, subject, text,html

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
    Complaints.find({},{_id:1, productId:1, title:1, creatorId:1, timeStamp:1, completed:1},(err, doc) => {
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
    exports.activeproducts = async (req, res) => {
                AllProducts.find({active:true},{_id:1, title:1, creator:1, timeStamp:1, category:1, active:1, blocked:1, sold:1, deleted:1, refId:1},(err, doc) => {
                    if (err) res.json({ status: "failed", message: err })
                    else {
                        res.send({
                            success: doc
                        })
                    }
                })
            
        }

    exports.blockedproducts = async (req, res) => {
        AllProducts.find({blocked:true},{_id:1, title:1, creator:1, timeStamp:1, category:1, active:1, blocked:1, sold:1, deleted:1, refId:1},(err, doc) => {
                if (err) res.json({ status: "failed", message: err })
                else {
                    res.send({
                        success: doc
                    })
                }
            })
        
    }

    exports.deletedproducts = async (req, res) => {
        AllProducts.find({deleted:true},{_id:1, title:1, creator:1, timeStamp:1, category:1, active:1, blocked:1, sold:1, deleted:1, refId:1},(err, doc) => {
            if (err) res.json({ status: "failed", message: err })
            else {
                res.send({
                    success: doc
                })
            }
        })
    
}

exports.soldproducts = async (req, res) => {
    AllProducts.find({sold:true},{_id:1, title:1, creator:1, timeStamp:1, category:1, active:1, blocked:1, sold:1, deleted:1, refId:1},(err, doc) => {
        if (err) res.json({ status: "failed", message: err })
        else {
            res.send({
                success: doc
            })
        }
    })

}

exports.inactiveproducts = async (req, res) => {
    AllProducts.find({active:false, blocked:false, deleted:false, sold:false},{_id:1, title:1, creator:1, timeStamp:1, category:1, active:1, blocked:1, sold:1, deleted:1, refId:1},(err, doc) => {
        if (err) res.json({ status: "failed", message: err })
        else {
            res.send({
                success: doc
            })
        }
    })
}

exports.allproducts = async (req, res) => {
    AllProducts.find({},{_id:1, title:1, creator:1, timeStamp:1, category:1, active:1, deleted:1, blocked:1, sold:1, refId:1},(err, doc) => {
        if (err) res.json({ status: "failed", message: err })
        else {

            res.send({
                success: doc
            })
        }
    })

}