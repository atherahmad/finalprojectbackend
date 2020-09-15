const router  = require("express").Router();
const admin = require("../controller/admin")
const auth    = require("../middleware/checkAuthentication")

router.get("/getquerries",auth.checkToken, admin.querriesList)
router.get("/querrydetails/:id", auth.checkToken, admin.querryDetails)
router.get("/getuserlist",auth.checkToken, admin.usersList)

router.get("/getcomplaints",auth.checkToken, admin.complaintsList)
router.get("/complaindetails/:id",auth.checkToken, admin.complainDetails)
router.post("/handlecomplain",auth.checkToken, admin.complainHandler)


router.post("/blockproduct", auth.checkToken, admin.blockProduct )


router.get("/activeproducts",auth.checkToken, admin.activeProducts)
router.get("/inactiveproducts",auth.checkToken, admin.inactiveProducts)
router.get("/blockedproducts",auth.checkToken, admin.blockedProducts)
router.get("/soldproducts",auth.checkToken, admin.soldProducts)
router.get("/deletedproducts",auth.checkToken, admin.deletedProducts)
router.get("/productdetails/:id", auth.checkToken, admin.productDetails)
router.get("/allproducts",auth.checkToken, admin.allProducts)

router.post("/searchproduct",auth.checkToken, admin.searchProduct)

router.get(`/userdetails/:userId`, auth.checkToken, admin.userDetails)

router.post("/updateuser", auth.checkToken, admin.updateUser)


module.exports = router
