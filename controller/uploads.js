const cloudinary = require("../utils/cloudinary");
const User = require("../model/userModel");

const fs = require("fs");

exports.profile = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*")
  const uploader = async (path) => await cloudinary.uploads(path, "file");

  const file = req.file;
  const { path } = file;

  const newPath = await uploader(path);

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
    profileImage: newPath.url,
  };

  console.log(profileData, "url in post");

  fs.unlinkSync(path);

  if (newPath)
    await User.findByIdAndUpdate(req.userId, profileData, (err, doc) => {
      if (err) res.json({ status: "failed", message: err });
      else
        res.json({
          status: "success",
          message: "Records updated successfully",
          data: doc,
        });
    });
  else res.json({ status: "failed", message: "Failed to upload image" });
};

exports.product = async (req, res) => {};
