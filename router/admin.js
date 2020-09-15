const router  = require("express").Router();
const admin = require("../controller/admin")
const auth    = require("../middleware/checkAuthentication")

router.get("/getquerries",auth.checkToken, admin.querriesList)
router.get("/getuserlist",auth.checkToken, admin.usersList)
router.get("/getcomplaints",auth.checkToken, admin.complaintsList)

router.post("/blockproduct", auth.checkToken, admin.blockProduct )


router.get("/activeproducts",auth.checkToken, admin.activeProducts)
router.get("/inactiveproducts",auth.checkToken, admin.inactiveProducts)
router.get("/blockedproducts",auth.checkToken, admin.blockedProducts)
router.get("/soldproducts",auth.checkToken, admin.soldProducts)
router.get("/deletedproducts",auth.checkToken, admin.deletedProducts)
router.get("/allproducts",auth.checkToken, admin.allProducts)

router.get(`/userdetails/:userId`, auth.checkToken, admin.userDetails)


module.exports = router
