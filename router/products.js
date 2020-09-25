const router = require("express").Router()
const products   = require("../controller/products")
const auth   = require("../middleware/checkAuthentication")

//router.post("/newproduct",auth.checkToken, products.newProduct)
router.post("/inactiveproduct",auth.checkToken, products.inactiveProduct)
router.post("/soldproduct",auth.checkToken, products.soldProduct)
router.post("/deleteproduct",auth.checkToken, products.deleteProduct)
router.post("/activateproduct",auth.checkToken, products.activateProduct)
router.post("/editproduct",auth.checkToken, products.editProduct)
router.post("/blockproduct",auth.checkToken, products.blockProduct)







module.exports=router