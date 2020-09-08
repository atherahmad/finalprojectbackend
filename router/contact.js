const router = require("express").Router()
const contact   = require("../controller/contact")

router.post("/querry", contact.querry)
router.post(`/complaint`, contact.complaint)

module.exports=router
//localhost:3000/api/contact/querry 
