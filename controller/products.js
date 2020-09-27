
const ActiveProduct = require("../model/activeProductModel");
const AllProducts = require("../model/allProductModel")
const InActiveProduct = require("../model/inactiveProductModel")
const SoldProduct = require("../model/soldProductModel")
const DeletedProduct = require("../model/deletedProductModel")
/* const multer  = require("multer");
const path    = require("path");
const cp      = require('child_process');
 */


exports.inactiveProduct=async(req,res)=>{
    const productId= req.body.data.id  
    await ActiveProduct.findOne({_id:productId, creator:req.userId},(err,result)=>{
    if(err) return res.json({failed:"Sorry! your request is failed"})
    if(result){
        result.remove()
        result=result.toObject()
        result.active=false
        let swap = new InActiveProduct(result)
        swap.save()
        AllProducts.findOneAndUpdate({refId:req.body.data.id},{active:false},(err,doc)=>{
            if(err) res.json({failed:"Sorry! your request is failed"})
                else res.json({success:"You have successfully updated product"})
        })
        }
    })
    
}

exports.soldProduct=async(req,res)=>{
    const productId= req.body.data.id  
    await ActiveProduct.findOne({_id:productId, creator:req.userId},(err,result)=>{
        if(err) return res.json({failed:"Sorry! your request is failed"})
        if(result){
            result.remove()
            result=result.toObject()
            result.sold=true
            result.active=false
            let swap = new SoldProduct(result)
            swap.save()
            AllProducts.findOneAndUpdate({refId:req.body.data.id},{sold:true, active:false},(err,doc)=>{
                if(err) res.json({failed:"Sorry! your request is failed"})
                    else res.json({success:"You have successfully updated product"})
            })
        }

    })
}

exports.deleteProduct=async(req,res)=>{
    const productId= req.body.data.id  
    await ActiveProduct.findOne({_id:productId, creator:req.userId},(err,result)=>{
        if(err) return res.json({failed:"Sorry! your request is failed"})
        if(result){
            result.remove()
            result=result.toObject()
            result.active=false
            result.deleted=true
            let swap = new DeletedProduct(result)
            swap.save()
            AllProducts.findOneAndUpdate({refId:req.body.data.id},{deleted:true, active:false},(err,doc)=>{
                if(err) res.json({failed:"Sorry! your request is failed"})
                    else res.json({success:"You have successfully updated product"})
            })
        }
})
}

exports.activateProduct=async(req,res)=>{
    const productId= req.body.data.id  
    await InActiveProduct.findOne({_id:productId, creator:req.userId},(err,result)=>{
        if(err) return res.json({failed:"Sorry! your request is failed"})
        if(result){
            result.remove()
            result=result.toObject()
            result.active=true
            let swap = new ActiveProduct(result)
            swap.save();
            AllProducts.findOneAndUpdate({refId:req.body.data.id},{active:true},(err,doc)=>{
                if(err) res.json({failed:"Sorry! your request is failed"})
                    else res.json({success:"You have successfully updated product"})
            })
        }
    })
}

