const router = require("express").Router();
const uploads = require("../controller/uploads");
const upload = require("../middleware/multer");
const auth = require("../middleware/checkAuthentication");

router.post(
  "/profile",
  auth.checkToken,
  upload.single("file"),
  uploads.profile
);
router.post("/product", uploads.product);

module.exports = router;
