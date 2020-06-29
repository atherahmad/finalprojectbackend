const router  = require("express").Router();
const messages = require("../controller/messages")
const auth    = require("../middleware/checkAuthentication")

router.post("/sendmessage",auth.checkToken, messages.createMessage)
router.get("/messageslist",auth.checkToken, messages.messagesList)
router.post("/deletemessages", auth.checkToken,messages.deleteMessages)
router.get("/getconversation/:id",auth.checkToken, messages.getConversation)
router.post("/updateconversation",auth.checkToken, messages.updateConversation)



module.exports = router
