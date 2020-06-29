const router = require("express").Router()
const buy   = require("../controller/buy")

router.get("/allproducts", buy.allProucts)
router.get(`/activeproductdetails/:id`, buy.productDetails)
router.get(`/latestprdoucts`, buy.latestProducts)
router.get("/categories/:type", buy.productsByCategory)
router.get("/categoriessearch/:type", buy.productsBySearch)
router.post("/filteredproducts", buy.productsByFilter)




module.exports=router