const router  = require("express").Router();
const admin = require("../controller/admin")
const auth    = require("../middleware/checkAuthentication")

router.get("/getquerries",auth.checkToken, admin.querries)
router.get("/getuserlist",auth.checkToken, admin.userlist)
router.get("/getproducts",auth.checkToken, admin.productlist)



module.exports = router
