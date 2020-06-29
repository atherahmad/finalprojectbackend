const mongoose = require('mongoose');
//const Conversations = require("./conversationModel")

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'email is a must!']
    },
    lastName:{
        type:String,
        required: [true, 'email is a must!']
    },
    email: {
        type: String,
        required: [true, 'email is a must!'],
        unique: true
    },
    pass: {
        type: String,
        required: [true, 'Password is a must!']
    },
    phoneNumber:{
        type: Number
    },
    paypalId:{
        type:String
    },
    address:{
        type:Object,
        properties:{
            street:{
                type:String,
            },
            city:{
                type:String,
            },
            zipCode:{
                type:Number,
            }
        }

    },
    unsuccessfullAttempts:{
        type:Number,
    },
    status:{
        type:Boolean
    },
    accessLevel:{
        type:String
    },
    confirmed:{
        type:Boolean,
        required:[true, "Confirmation is must"]
    
    },
    profileImage:{
        type:String
    },
    liked:{
        type: Array,
        required: true, 
      },
    lastSeen:{
        type: Array,
        required: true, 
      }/* ,
      activeConversations:{
        type: Array,
        required: true,
        items:{
          type:Object,
          properties:{
            conversationId:{type: mongoose.Schema.Types.ObjectId, ref: Conversations},
            read:{
              type:Boolean,
              required:true
            }
          }
        }
    } */

})

module.exports = mongoose.model("c2cusers", UserSchema)