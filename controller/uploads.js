const cloudinary = require("../utils/cloudinary");
const User = require("../model/userModel");
const ActiveProduct = require("../model/activeProductModel");
const AllProducts = require("../model/allProductModel");

const fs = require("fs");

exports.profile = async (req, res) => {
  let profileData = {};
  const {
    firstName,
    lastName,
    paypalId,
    phoneNumber,
    street,
    city,
    zipCode,
  } = req.body.data ? req.body.data : req.body;

  if (req.file) {
    const uploader = async (path) => await cloudinary.uploads(path, "file");
    const file = req.file;
    const { path } = file;
    const newPath = await uploader(path);

    profileData = {
      firstName,
      lastName,
      paypalId,
      phoneNumber,
      address: {
        street,
        city,
        zipCode,
      },
      profileImage: newPath.url,
    };

    fs.unlinkSync(path);
    if (!newPath)
      return res.json({ status: "failed", message: "Failed to upload image" });
  } else
    profileData = {
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
        data: doc,
      });
  });
};

exports.product = async (req, res) => {
  const {
    title,
    category,
    condition,
    quantity,
    color,
    price,
    description,
  } = req.body.data ? req.body.data : req.body;
  const creator = req.userId;
  let urls = [];
  let priceRange;

  if (price >= 250) priceRange = 6;
  else if (price >= 200) priceRange = 5;
  else if (price >= 150) priceRange = 4;
  else if (price >= 100) priceRange = 3;
  else if (price >= 50) priceRange = 2;
  else priceRange = 1;

  if (req.files) {
    const uploader = async (path) => await cloudinary.uploads(path, "images");

    const files = req.files;
    for (const file of files) {
      const { path } = file;
      const newPath = await uploader(path);
      if (!newPath)
        return res.json({
          status: "failed",
          message: "Failed to upload image",
        });
      urls.push(newPath.url);
      fs.unlinkSync(path);
    }
  }

  const newProduct = new ActiveProduct({
    title,
    category,
    condition,
    quantity,
    color,
    price,
    description,
    creator,
    blocked: false,
    sold: false,
    active: true,
    views: 0,
    watching: [],
    priceRange,
    images: urls,
  });
  newProduct.save((err, doc) => {
    if (err) {
      res.json({ status: "failed", message: err });
    } else {
      const newAllProduct = new AllProducts({
        title,
        category,
        condition,
        quantity,
        color,
        price,
        description,
        creator,
        blocked: false,
        sold: false,
        active: true,
        views: 0,
        watching: [],
        priceRange,
        deleted: false,
        refId: doc._id,
        images: urls,
      });

      newAllProduct.save((err, doc) => {
        if (err) res.json({ status: "failed", message: err });
        else {
          res.json({
            status: "success",
            message: "you have successfuly posted your product",
            data: doc,
          });
        }
      });
    }
  });
};
