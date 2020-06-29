const Conversation = require("../model/conversationModel")
const User = require("../model/userModel")
const ActiveProduct= require("../model/activeProductModel")


exports.createMessage=async(req,res)=>{
    const {message, senderId, productId, recipentId, title}=req.body.data
    if(!message) return
    let conversationResult = await Conversation
                                .findOne({$and:[{senderId, productId}]})
    if(!conversationResult){
        const newConversation = new Conversation({
            messages:[{
                senderId,
                message,
            }],
            senderId,
            productId,
            recipentId,
            title})
        await newConversation.save(async(err,doc)=>{
            if(err) {
                res.json({status:"failed", message:"Currently unable to send your meesage please try again", data:err})
                throw err
            }
            else{
                await User.findByIdAndUpdate(req.userId,
                    {$addToSet:{activeConversations:{
                                            conversationId:doc._id,
                                            read:false
                                        }}}, (err,doc)=>{
                                            if(err) {
                                                res.json({status:"failed", message:"Currently unable to send your meesage please try again", data:err})
                                                throw err
                                            }
                                            else {
                                            console.log(doc, "in conversation")
                                            res.json({status:"success", message:"Successfully sent!, Conversation created", data:doc})
                                            }
                                        })
                                    }
                                    })
            } else{

                const{_id} = conversationResult._id
                await Conversation.findByIdAndUpdate(_id,
                {$addToSet:{messages:{
                senderId,
                message
                    }}},(err,doc)=>{
                 if(err) res.json({status:"failed", message:"Unable to send your message, please try again",data:err})
                    else res.json({status:'success', message:"added in previous conversation", data:doc})
                    })
           

    }

}
exports.messagesList=async(req,res)=>{
    let senderId=req.userId
    let recipentId=req.userId
    let conversationResult = await Conversation
    .find({$or:[{senderId}, {recipentId}]})
    .populate([{path:"senderId",select:"firstName", model:User},{path:"recipentId",select:"firstName", model:User}])
    //.populate([{path:"senderId",select:"firstName", model:User},{path:"recipentId",select:"firstName", model:User}])

    if(!conversationResult)  {
        res.json({status:"failed", message:"You have no active conversation", data:[]})}
        else {
            res.json({status:"success", message:"successfully retrieved", data:conversationResult})
        }

}

exports.getConversation=async(req,res)=>{
    let conversationResult = await Conversation.findById(req.params.id,{messages:1,productId:1})
                                              .populate([{path:"productId",select:"title", model:ActiveProduct}])
    res.json({status:"success", message:"you reached getconversation", data:conversationResult})
    
}

exports.updateConversation=async(req,res)=>{
    const {conversationId,message}=req.body.data
    if(message==="") return console.log("empty msg")
    else
    await Conversation.findOneAndUpdate(
        {
                $and:[{_id:conversationId}, {$or:[{senderId:req.userId},{recipentId:req.userId}]}]
            },
                    {$addToSet:{messages:{
                                senderId:req.userId,
                                message:message
                            }}}
                ,{
                    new:true
    
                    },(err,doc)=>{
                    if(err) res.json({status:"failed", message:"Unable to send your message, please try again",data:err})
                        else {res.json({status:'success', message:"added in previous conversation", data:doc.messages})}
                })
}

exports.deleteMessages=async(req,res)=>{
    console.log(req.body.data, "req from fe")
    await Conversation.deleteMany({$or:[{senderId:req.userId},{recipentId:req.userId}], _id:{$in:req.body.selectedArray}},(err,doc)=>{
        if(err) res.json({failed:err})
        else {
            console.log(doc)
            res.json({success:"you have successfully deleted messagges"})
        }
    })
}
