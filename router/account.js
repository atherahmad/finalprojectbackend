const router = require("express").Router();
const account = require("../controller/account")
const auth = require("../middleware/checkAuthentication")

router.get("/profile", auth.checkToken, account.getProfile)
router.get("/myproducts", auth.checkToken, account.getMyProducts)
router.get("/soldproducts", auth.checkToken, account.getSoldProducts)
router.get("/inactiveproducts", auth.checkToken, account.getInactiveProducts)
router.get("/lastseen", auth.checkToken, account.getLastSeen)
router.post("/lastseen", auth.checkToken, account.lastSeen)
router.post("/setfavorities", auth.checkToken, account.setFavorities)
router.get("/getfavoritelist", auth.checkToken, account.getFavoritiesList)
router.get("/getfavoriteproducts", auth.checkToken, account.getFavoriteProducts)
router.get(`/inactiveproductdetails/:id`, auth.checkToken, account.inactiveProductDetails)
router.get(`/soldproductdetails/:id`, auth.checkToken, account.soldProductDetails)
router.post(`/editproduct`, auth.checkToken, account.editProduct)






module.exports = router

