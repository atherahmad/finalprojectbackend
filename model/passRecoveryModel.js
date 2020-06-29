const mongoose = require("mongoose")
const PassRecoveryModel = new mongoose.Schema({

    userId:{
        type:String
    },
    recovered:{
        type:Boolean
    },
    requestTimeStamp:{
        type:Date
    },
    recoveryTimeStamp:{
        type:Date
    },
    tokenId:{
        type:String
    },
    previousePass:{
        type:String
    }

})
module.exports = mongoose.model("passrecovery",PassRecoveryModel)