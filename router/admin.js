const router  = require("express").Router();
const admin = require("../controller/admin")
const auth    = require("../middleware/checkAuthentication")

router.get("/getquerries",auth.checkToken, admin.querriesList)
router.get("/getuserlist",auth.checkToken, admin.usersList)
router.get("/getproducts",auth.checkToken, admin.productsList)
router.get("/getcomplaints",auth.checkToken, admin.complaintsList)



module.exports = router
