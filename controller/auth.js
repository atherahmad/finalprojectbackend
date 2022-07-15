const User = require("../model/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const jwtSecretKey = process.env.JWT_SECRET_KEY;
const emailCheck = require("../middleware/nodemailer");
const adminJwtSecretKey = process.env.ADMIN_JWT_SECRET_KEY;

//Token Generator
const createToken = (id) => jwt.sign({ id }, jwtSecretKey, { expiresIn: 3600 });

const createAdminToken = (id) =>
  jwt.sign({ id }, adminJwtSecretKey, { expiresIn: 3600 });

//Sign in  Area
exports.signin = async (req, res) => {
  const { email, pass } = req.body.data;
  await User.findOne({ email }, (err, result) => {
    if (err)
      return res.status(500).json({
        status: "failed",
        message:
          "Sorry, we are unable to process your request please try again",
      });

    if (!result)
      return res.json({
        status: "failed",
        message: "Authorization failed , please check your credentials",
      });

    bcrypt.compare(pass, result.pass).then(async (isPassCorrect) => {
      if (isPassCorrect) {
        if (result.confirmed) {
          const { id, firstName, lastName, liked, email, admin } = result;
          let token = "";
          if (admin) token = await createAdminToken(result.id);
          else token = await createToken(result.id);
          res.json({
            status: "success",
            message: "Welcome! you are successfully logged in. ",
            data: { id, firstName, lastName, liked, email, admin },
            token,
          });
        } else
          res.json({
            status: "failed",
            message:
              "Authentication failed, please confirm you email address first",
          });
      } else
        res.json({
          status: "failed",
          message: "Authorization failed , please check your credentials",
        });
    });
  });
};

// Signup Area
exports.signup = async (req, res) => {
  const { firstName, lastName, email, pass } = req.body.data;

  let userCheck = await User.findOne({ email });

  if (userCheck) {
    return res.json({
      status: "failed",
      message: "Sorry! this email is already registered with us",
    });
  }

  let hashedPass = await bcrypt.hash(pass, 10);
  if (!hashedPass)
    return res
      .status(501)
      .json({
        status: "failed",
        message: "Technical Erro 501, Please contact support team!",
      });
  const newUser = new User({
    firstName,
    lastName,
    email,
    pass: hashedPass,
    confirmed: false,
    admin: false,
  });
  newUser.save(async (err, doc) => {
    if (err) res.status(500).json({ status: "failed", message: err });
    else {
      const payload = {
        id: doc._id,
        email: doc.email,
      };
      const confirmationToken = await jwt.sign(payload, jwtSecretKey, {
        expiresIn: 3600,
      });

      doc.html = `<b>To Confirm your email address please <a href="https://vigorous-einstein-134bd7.netlify.app/#/confirm/${doc.id}/${confirmationToken}">Click here!</a></b>`;
      doc.subject = "Confirm your email";
      let emailStatus = await emailCheck.confirmation(doc);
      console.log("in auth.js email status", emailStatus)
      if (emailStatus)
        res.json({
          status: "success",
          message: "Welcome ! Your account is successfully created",
        });
      else
        res.json({
          status: "failed",
          message: "Request failed please try again",
        });
    }
  });
};
//Checking Authentication of user

exports.authenticated = async (req, res) => {
  await User.findById(
    req.userId,
    { _id: 1, firstName: 1, liked: 1, email: 1, admin: 1 },
    (err, doc) => {
      if (err)
        return res.json({
          status: "failed",
          message: "Unable to retrieve your data please try again",
        });

      res.json({
        status: "success",
        message: "You have been authorized",
        data: doc,
      });
    }
  );
};
exports.changePassword = async (req, res) => {
  const { pass, confirmPass, oldPass } = req.body.data;

  if (pass !== confirmPass)
    return res.json({
      status: "failed",
      message: "Request Failed, Please check your inputs",
    });

  await User.findById(req.userId, (err, result) => {
    if (err)
      return res.status(500).json({
        status: "failed",
        message:
          "Sorry, we are unable to process your request please try again",
      });

    if (!result)
      return res.json({
        status: "failed",
        message: "Authorization failed , please check your credentials",
      });

    bcrypt.compare(oldPass, result.pass).then(async (isPassCorrect) => {
      if (!isPassCorrect)
        return res.json({
          status: "failed",
          message: "Authorization failed , please check your credentials",
        });
      if (isPassCorrect) {
        let hashedPass = await bcrypt.hash(pass, 10);
        const profileData = { pass: hashedPass };
        await User.findByIdAndUpdate(
          req.userId,
          profileData,
          async (err, doc) => {
            if (err) return res.json({ status: "failed", message: err });
            else {
              res.json({
                status: "success",
                message: "You have succesfully cahnged your password",
              });
            }
          }
        );
      }
    });
  });
};

exports.confirmEmail = async (req, res) => {
  const { token } = req.body;

  await jwt.verify(token, jwtSecretKey, async (fail, decodedPayload) => {
    if (fail)
      return res.json({
        failed: "Authentication failed!",
      });
    else {
      let id = decodedPayload.id;
      await User.findByIdAndUpdate(id, { confirmed: true }, (err, doc) => {
        if (err)
          res.json({ failed: "Your request is failed please try again" });
        else
          res.json({
            success: "You have successfuly confirmed your email address.",
          });
      });
    }
  });
};
