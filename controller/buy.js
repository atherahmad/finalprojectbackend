const ActiveProducts = require("../model/activeProductModel")
const User = require("../model/userModel")
const jwt = require("jsonwebtoken")
const jwtSecretKey= process.env.JWT_SECRET_KEY
exports.allProucts = async (req, res) => {
    ActiveProducts.find({}, {
        _id: 1,
        title: 1,
        category: 1,
        condition: 1,
        color: 1,
        price: 1,
        images: 1,
        priceRange: 1,

    }).exec((err, doc) => {
        if (err) res.json({ status: "failed", message: err })
        else {
            res.send({
                status: "success",
                message: "Your reached Buy products",
                data: doc
            })
        }
    })
}

exports.productDetails = async (req, res) => {

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

exports.latestProducts =async(req,res)=>{

    let latest= await ActiveProducts.find({},{
        _id: 1,
        title: 1,
        category: 1,
        condition: 1,
        color: 1,
        price: 1,
        images: 1,
        priceRange: 1,

    }).sort({'_id':-1}).limit(4)

    if(latest) return res.json({status:"success",data:latest})
        else res.json({status:"failed",message:"request failed"})

}

exports.productsByCategory=async(req,res)=>{

    let category=req.params.type
    let result;
    if(category==="0")
    result = await ActiveProducts.find({},{
        _id: 1,
        title: 1,
        category: 1,
        condition: 1,
        color: 1,
        price: 1,
        images: 1,
        priceRange: 1,

    }).sort({'_id':-1})
    else
result = await ActiveProducts.find({category},{
        _id: 1,
        title: 1,
        category: 1,
        condition: 1,
        color: 1,
        price: 1,
        images: 1,
        priceRange: 1,

    }).sort({'_id':-1})

    if(!result) res.json({failed:"Request failed try again"})
        else res.json({success:"success", products:result})
}

exports.productsBySearch=async(req,res)=>{
    
    let text=req.query.text
    let category=req.params.type
    let result;
    var regex = new RegExp(".*" + text + ".*","i")

    if(category==="0")
result = await ActiveProducts.find({title: {$regex:regex}},
    {
        _id: 1,
        title: 1,
        category: 1,
        condition: 1,
        color: 1,
        price: 1,
        images: 1,
        priceRange: 1,

    }).sort({'_id':-1})
    else
result = await ActiveProducts.find({title: {$regex:regex}},{
        _id: 1,
        title: 1,
        category: 1,
        condition: 1,
        color: 1,
        price: 1,
        images: 1,
        priceRange: 1,

    }).sort({'_id':-1})

    if(!result) res.json({failed:"Request failed try again"})
        else res.json({success:"success", products:result})
}

exports.productsByFilter=async(req,res)=>{
    const {color,category,condition,price}=req.body
    let query={}
    if (color!==0) query.color=color
    if(category!==0) query.category=category
    if(condition!==0) query.category=condition
    if(price!==0) query.priceRange=price

    let result = await ActiveProducts.find(query,{
        _id: 1,
        title: 1,
        category: 1,
        condition: 1,
        color: 1,
        price: 1,
        images: 1,
        priceRange: 1,

    }).sort({'_id':-1})

    if(result) res.json({success:result})
        else res.json({failed:"request failed try again"})
}