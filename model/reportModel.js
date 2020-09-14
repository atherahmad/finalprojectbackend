
const mongoose = require("mongoose");

const ReportSchema = new mongoose.Schema({

  productId:{
    type:String,
    required:true
  },
  creatorId:{
    type:String,
    required:true
  },
  title:{
    type:String,
    required:true
  },
  message:{
    type:String,
    required:true
  },
  timeStamp:{
    type : Date,
    default:Date.now
  },
  completed:{
    type:Boolean,
    required:true
  }
  
});

module.exports = mongoose.model("complaints", ReportSchema)
