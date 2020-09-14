const router  = require("express").Router();
const admin = require("../controller/admin")
const auth    = require("../middleware/checkAuthentication")

router.get("/getquerries",auth.checkToken, admin.querriesList)
router.get("/getuserlist",auth.checkToken, admin.usersList)
router.get("/getcomplaints",auth.checkToken, admin.complaintsList)
router.post("/blockproduct", auth.checkToken, admin.blockProduct )


router.get("/activeproducts",auth.checkToken, admin.activeproducts)
router.get("/inactiveproducts",auth.checkToken, admin.inactiveproducts)
router.get("/blockedproducts",auth.checkToken, admin.blockedproducts)
router.get("/soldproducts",auth.checkToken, admin.soldproducts)
router.get("/deletedproducts",auth.checkToken, admin.deletedproducts)
router.get("/allproducts",auth.checkToken, admin.allproducts)


module.exports = router
