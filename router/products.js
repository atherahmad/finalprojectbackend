const router = require("express").Router();
const products = require("../controller/products");
const auth = require("../middleware/checkAuthentication");

router.post("/inactiveproduct", auth.checkToken, products.inactiveProduct);
router.post("/soldproduct", auth.checkToken, products.soldProduct);
router.post("/deleteproduct", auth.checkToken, products.deleteProduct);
router.post("/activateproduct", auth.checkToken, products.activateProduct);

module.exports = router;
