
const mongoose = require("mongoose");

const QuerriesSchema = new mongoose.Schema({

  name:{
    type:String,
    required:true
  },
  email:{
    type:String,
    required:true
  },
  subject:{
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

module.exports = mongoose.model("querries", QuerriesSchema)
