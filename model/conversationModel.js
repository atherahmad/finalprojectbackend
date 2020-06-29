
const mongoose = require("mongoose");
const User = require("./userModel");
const ActiveProduct = require("./activeProductModel")

const ConversationSchema = new mongoose.Schema({

  messages:{
    type: Array,
    required: true,
    items:{
      type:Object,
      properties:{
        senderId:{
          type:String,
          required:true
        },
        message:{
          type:String,
          required:true
        },
        timeStamp:{
          type : Date,
          default: Date.now 
        }
      }
    }
  },
  title:{
          type:String,
          required:true
  },
  recipentId:{type: mongoose.Schema.Types.ObjectId, ref: User},
  senderId:{type: mongoose.Schema.Types.ObjectId, ref: User},
  productId:{type: mongoose.Schema.Types.ObjectId, ref: ActiveProduct},
  timeStamp:{
    type : Date,
    default:Date.now
  }
  
   
});

module.exports = mongoose.model("c2cconversations", ConversationSchema)
