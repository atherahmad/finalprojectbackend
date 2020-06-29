const router = require("express").Router();
const dashBoard   = require("../controller/dashboard")

router.get("/dashboard", dashBoard.myAccount)


module.exports = router;