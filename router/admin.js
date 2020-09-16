const router  = require("express").Router();
const admin = require("../controller/admin")
const adminAuth    = require("../middleware/adminAuthentication")
const auth = require("../controller/auth")
const account = require("../controller/account")

router.get("/getquerries",adminAuth.adminAuthCheck, admin.querriesList)
router.get("/querrydetails/:id", adminAuth.adminAuthCheck, admin.querryDetails)
router.post("/handlequerry", adminAuth.adminAuthCheck, admin.querryHandler)

router.get("/getuserlist",adminAuth.adminAuthCheck, admin.usersList)

router.get("/getcomplaints",adminAuth.adminAuthCheck, admin.complaintsList)
router.get("/complaindetails/:id",adminAuth.adminAuthCheck, admin.complainDetails)
router.post("/handlecomplain",adminAuth.adminAuthCheck, admin.complainHandler)


router.post("/blockproduct", adminAuth.adminAuthCheck, admin.blockProduct )


router.get("/activeproducts",adminAuth.adminAuthCheck, admin.activeProducts)
router.get("/inactiveproducts",adminAuth.adminAuthCheck, admin.inactiveProducts)
router.get("/blockedproducts",adminAuth.adminAuthCheck, admin.blockedProducts)
router.get("/soldproducts",adminAuth.adminAuthCheck, admin.soldProducts)
router.get("/deletedproducts",adminAuth.adminAuthCheck, admin.deletedProducts)
router.get("/productdetails/:id", adminAuth.adminAuthCheck, admin.productDetails)
router.get("/allproducts",adminAuth.adminAuthCheck, admin.allProducts)

router.post("/searchproduct",adminAuth.adminAuthCheck, admin.searchProduct)

router.get(`/userdetails/:userId`, adminAuth.adminAuthCheck, admin.userDetails)

router.post("/updateuser", adminAuth.adminAuthCheck, admin.updateUser)

router.post("/changepassword", adminAuth.adminAuthCheck, auth.changePassword)
router.get("/profile", adminAuth.adminAuthCheck, account.getProfile)
router.post("/profile", adminAuth.adminAuthCheck, account.editProfile)
router.post(`/editproduct`, adminAuth.adminAuthCheck, account.editProduct)



module.exports = router
