const Querry = require("../model/querriesModel")
const User=require("../model/userModel")
const Complaints=require("../model/reportModel")
const ActiveProducts = require("../model/activeProductModel")
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
            result.blocked=true
            let swap = new BlockedProduct(result)
            swap.save()
            res.json({success:"You have successfully marked the Product Sold"})
        }
        
    })
}
    exports.activeproducts = async (req, res) => {
                ActiveProducts.find({},{_id:1, title:1, creator:1, timeStamp:1, category:1},(err, doc) => {
                    if (err) res.json({ status: "failed", message: err })
                    else {
                        res.send({
                            success: doc
                        })
                    }
                })
            
        }

    exports.blockedproducts = async (req, res) => {
        BlockedProduct.find({},{_id:1, title:1, creator:1, timeStamp:1, category:1},(err, doc) => {
                if (err) res.json({ status: "failed", message: err })
                else {
                    res.send({
                        success: doc
                    })
                }
            })
        
    }

    exports.deletedproducts = async (req, res) => {
        DeletedProducts.find({},{_id:1, title:1, creator:1, timeStamp:1, category:1},(err, doc) => {
            if (err) res.json({ status: "failed", message: err })
            else {
                res.send({
                    success: doc
                })
            }
        })
    
}

exports.soldproducts = async (req, res) => {
    SoldProducts.find({},{_id:1, title:1, creator:1, timeStamp:1, category:1},(err, doc) => {
        if (err) res.json({ status: "failed", message: err })
        else {
            res.send({
                success: doc
            })
        }
    })

}

exports.inactiveproducts = async (req, res) => {
    InactiveProducts.find({},{_id:1, title:1, creator:1, timeStamp:1, category:1},(err, doc) => {
        if (err) res.json({ status: "failed", message: err })
        else {
            res.send({
                success: doc
            })
        }
    })
}

exports.allproducts = async (req, res) => {
    ActiveProducts.find({},{_id:1, title:1, creator:1, timeStamp:1, category:1},(err, doc) => {
        if (err) res.json({ status: "failed", message: err })
        else {
            res.send({
                success: doc
            })
        }
    })

}