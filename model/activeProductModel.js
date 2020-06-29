const mongoose = require("mongoose")
const User = require("./userModel")
const ActiveProductSchema= new mongoose.Schema({

    title:{
        type:String
    },
    category:{
        type:Number
    },
    condition:{
        type:Number
    },
    quantity:{
        type:Number
    },
    color:{
        type:Number
    },
    price:{
        type:Number
    },
    description:{
        type:String
    },
    creator:{type: mongoose.Schema.Types.ObjectId, ref: User},
    active:{
        type:Boolean
    },
    sold:{
        type:Boolean
    },
    blocked:{
        type:Boolean
    },
    priceRange:{
        type:Number
    },
    images:{
        type:Array
    },
    watching:{
        type:Array
    },
    timeStamp:{
        type : Date,
        default: Date.now 
      }
})
module.exports = mongoose.model("activeproducts", ActiveProductSchema)
