const router = require("express").Router();
const uploads = require("../controller/uploads");
const upload = require("../middleware/multer");
const auth = require("../middleware/checkAuthentication");

router.post(
  "/editprofile",
  auth.checkToken,
  upload.single("file"),
  uploads.profile
);
router.post(
  "/newproduct",
  auth.checkToken,
  upload.array(`images`),
  uploads.product
);
router.post(
  "/editproduct",
  auth.checkToken,
  upload.array(`images`),
  uploads.editProduct
);
module.exports = router;
