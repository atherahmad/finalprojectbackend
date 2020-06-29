const router  = require("express").Router();
const recovery    = require("../controller/recovery")

router.post("/resetlink", recovery.resetLink)
router.post("/resetcheck", recovery.recoverPassword)
router.post("/resetpass/:id", recovery.resetPassword)

module.exports = router;
