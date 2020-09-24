const User = require("../model/userModel");
const multer = require("multer");
const path = require("path");
const ActiveProducts = require("../model/activeProductModel");
const SoldProducts = require("../model/soldProductModel");
const InActiveProducts = require("../model/inactiveProductModel");
const cp = require("child_process");
const AllProducts = require("../model/allProductModel");
const { cloudinary } = require("../utils/cloudinary");

exports.getProfile = (req, res) => {
  User.findById(req.userId, (err, doc) => {
    if (err)
      return res.status(501).json({
        status: "failed",
        message: err,
      });
    else {
      const {
        firstName,
        lastName,
        email,
        paypalId,
        phoneNumber,
        profileImage,
      } = doc;
      let street, city, zipCode;
      if (doc.address) {
        street = doc.address.street;
        city = doc.address.city;
        zipCode = doc.address.zipCode;
      } else {
        street = "";
        city = "";
        zipCode = "";
      }
      const profile = {
        firstName,
        lastName,
        email,
        paypalId,
        phoneNumber,
        street,
        city,
        zipCode,
        profileImage,
      };
      res.json({
        status: "success",
        data: profile,
      });
    }
  });
};

exports.editProfile = async (req, res) => {
  if (req.body.data) {
    const {
      firstName,
      lastName,
      paypalId,
      phoneNumber,
      street,
      city,
      zipCode,
    } = req.body.data;
    const profileData = {
      firstName,
      lastName,
      paypalId,
      phoneNumber,
      address: {
        street,
        city,
        zipCode,
      },
    };
    await User.findByIdAndUpdate(req.userId, profileData, (err, doc) => {
      if (err) res.json({ status: "failed", message: err });
      else
        res.json({
          status: "success",
          message: "Records updated successfully",
        });
    });
    return;
  }
  let fileName;

  /*  const storageTarget = multer.diskStorage({
    destination: "public/avatars",
    filename: (req, file, cb) => {
      fileName = "a" + Date.now() + path.extname(file.originalname);
      cb(null, fileName);
    },
  });
  const upload = multer({ storage: storageTarget }).single(`file`); */

  const upload = multer({ dest: "public/uploads/" }).single("file");
  console.log(req.body, "while updating picture");

  /* upload(req, res, async () => {
    const {
      firstName,
      lastName,
      paypalId,
      phoneNumber,
      street,
      city,
      zipCode,
    } = req.body;

    const profileData = {
      firstName,
      lastName,
      paypalId,
      phoneNumber,
      address: {
        street,
        city,
        zipCode,
      },
      profileImage: fileName,
    };
    await User.findByIdAndUpdate(req.userId, profileData, (err, doc) => {
      if (err) res.json({ status: "failed", message: err });
      else
        res.json({
          status: "success",
          message: "Records updated successfully",
        });
    });
  }); */
};

exports.getMyProducts = async (req, res) => {
  let result = await ActiveProducts.find(
    { creator: req.userId },
    {
      _id: 1,
      title: 1,
      price: 1,
      images: 1,
    }
  );

  if (!result) {
    res.json({ failed: "Your have no Products" });
  } else {
    res.json({
      success: "You have successfully retrieved your products",
      products: result,
    });
  }
};

exports.lastSeen = async (req, res) => {
  let productId = req.body.data;
  /*     let condition = {
            $cond:{
                if: {$isArray:"lastSeen"},
                then:{$addToSet :{lastSeen:req.body.data}},
                else: "NA"
            }
        } */
  let result = await User.findById(req.userId, { lastSeen: 1 });
  let lastSeen = [...result.lastSeen];
  if (lastSeen.includes(productId))
    return res.json({ status: "success", message: "already there" });
  else {
    if (lastSeen.length >= 4) {
      lastSeen.shift();
      lastSeen.push(productId);
    } else lastSeen.push(productId);
  }

  await User.findByIdAndUpdate(req.userId, { lastSeen }, (err, doc) => {
    if (err) throw err;
    else res.json({ status: "success", message: "successfully added" });
  });
  /* await User.findByIdAndUpdate(req.userId,condition,(err,doc)=>{
        console.log(doc, "after last seen updat3e")
        res.json({status:"success", comments:"you reached last seen"})
    }) */
  //{$addToSet:{lastSeen:req.body.data}}
};

exports.getLastSeen = async (req, res) => {
  let result = await User.findById(req.userId, { lastSeen: 1 });
  if (!result) return res.json({ status: "failed" });

  let lastSeen = await ActiveProducts.find(
    {
      _id: {
        $in: result.lastSeen,
      },
    },
    {
      _id: 1,
      title: 1,
      category: 1,
      condition: 1,
      color: 1,
      price: 1,
      images: 1,
      priceRange: 1,
    }
  );
  if (!lastSeen)
    return res.json({
      status: "failed",
      message: "No product to show",
      data: [],
    });
  res.json({ status: "success", data: lastSeen });
};

exports.setFavorities = async (req, res) => {
  let id = req.userId;
  let productId = req.body.data;
  let result = await User.findById(id, { liked: 1 });
  if (!result) return res.json({ status: "failed" });
  let favourities = [...result.liked];

  let index = favourities.indexOf(productId);
  if (index === -1) favourities.push(productId);
  else favourities.splice(index, 1);
  await User.findByIdAndUpdate(id, { liked: favourities }, (err, doc) => {
    if (err) throw err;
    else res.json({ status: "success" });
  });
};

exports.getFavoritiesList = async (req, res) => {
  let id = req.userId;
  let result = await User.findById(id, { liked: 1 });
  if (!result) res.json({ status: "failed" });
  else res.json({ status: "success", favourities: result.liked });
};

exports.getFavoriteProducts = async (req, res) => {
  let id = req.userId;
  let result = await User.findById(id, { liked: 1 });
  if (!result) return res.json({ status: "failed" });
  let favoriteProducts = await ActiveProducts.find(
    {
      _id: {
        $in: result.liked,
      },
    },
    {
      _id: 1,
      title: 1,
      category: 1,
      condition: 1,
      color: 1,
      price: 1,
      images: 1,
      priceRange: 1,
    }
  );

  if (!favoriteProducts)
    return res.json({
      status: "failed",
      message: "No product to show",
      products: [],
    });
  res.json({ status: "success", products: favoriteProducts });
};

exports.getInactiveProducts = async (req, res) => {
  let id = req.userId;
  let result = await InActiveProducts.find(
    { creator: id },
    { _id: 1, title: 1, images: 1, price: 1 }
  );
  if (!result) return res.json({ failed: "You have no Inactive Products" });
  res.json({ success: "You have successfully retrieved", products: result });
};

exports.getSoldProducts = async (req, res) => {
  let id = req.userId;
  let result = await SoldProducts.find(
    { creator: id },
    { _id: 1, title: 1, images: 1, price: 1 }
  );
  if (!result) return res.json({ failed: "You have no Sold Products" });
  if (result)
    res.json({ success: "You have successfully retrieved", products: result });
};

exports.inactiveProductDetails = async (req, res) => {
  console.log("inactive details called");
  const id = req.params.id;
  let product = await InActiveProducts.findOne(
    { _id: id, creator: req.userId },
    {
      title: 1,
      category: 1,
      condition: 1,
      quantity: 1,
      color: 1,
      price: 1,
      description: 1,
      creator: 1,
      views: 1,
      images: 1,
    }
  ).populate([{ path: "creator", select: "firstName", model: User }]);
  if (!product) res.json({ failed: "Internal Error please try again" });
  else res.json({ success: product });
};

exports.soldProductDetails = async (req, res) => {
  const id = req.params.id;
  let product = await SoldProducts.findOne(
    { _id: id, creator: req.userId },
    {
      title: 1,
      category: 1,
      condition: 1,
      quantity: 1,
      color: 1,
      price: 1,
      description: 1,
      creator: 1,
      views: 1,
      images: 1,
    }
  ).populate([{ path: "creator", select: "firstName", model: User }]);
  if (!product) res.json({ failed: "Internal Error please try again" });
  else res.json({ success: product });
};

exports.editProduct = async (req, res) => {
  let fileName;
  const storageTarget = multer.diskStorage({
    destination: "public/avatars",
    filename: (req, file, cb) => {
      fileName = "a" + Date.now() + path.extname(file.originalname);
      cb(null, fileName);
    },
  });
  const upload = multer({ storage: storageTarget }).array("files", 6);
  upload(req, res, async () => {
    const {
      _id,
      title,
      category,
      condition,
      quantity,
      color,
      price,
      description,
    } = req.body;
    const creator = req.userId;
    let priceRange;
    if (price >= 250) priceRange = 6;
    else if (price >= 200) priceRange = 5;
    else if (price >= 150) priceRange = 4;
    else if (price >= 100) priceRange = 3;
    else if (price >= 50) priceRange = 2;
    else priceRange = 1;
    req.files.forEach((f) => {
      // create thunbnails
      // {public/images/18612876a87a74.jpg} => {public/images/18612876a87a74.jpg.thumb.jpg}
      const thumbPath = f.path + ".thumb.jpg";
      // $ convert $filePath -resize 500x $thumbPath
      // sudo apt install imagemagick
      cp.spawnSync("convert", [f.path, "-resize", "500x", thumbPath]);
    });

    if (req.files.length > 0) {
      let images = req.files.map((values) => values.filename);
      await ActiveProducts.findOneAndUpdate(
        { _id, creator },
        {
          title,
          category,
          condition,
          quantity,
          color,
          price,
          description,
          images,
          priceRange,
        },
        async (err, doc) => {
          if (err) throw err;
          else {
            await AllProducts.findOneAndUpdate(
              { refId: _id },
              {
                title,
                category,
                condition,
                quantity,
                color,
                price,
                description,
                priceRange,
                images,
              },
              (err, doc) => {
                if (err)
                  res.json({ status: "failed", message: "Request failed" });
                else res.json({ status: "success" });
              }
            );
          }
        }
      );
    } else
      await ActiveProducts.findOneAndUpdate(
        { _id, creator },
        {
          title,
          category,
          condition,
          quantity,
          color,
          price,
          description,
          priceRange,
        },
        async (err, doc) => {
          if (err) throw err;
          else {
            await AllProducts.findOneAndUpdate(
              { refId: _id },
              {
                title,
                category,
                condition,
                quantity,
                color,
                price,
                description,
                priceRange,
              },
              (err, doc) => {
                if (err)
                  res.json({ status: "failed", message: "Request failed" });
                else res.json({ status: "success" });
              }
            );
          }
        }
      );
  });
};
