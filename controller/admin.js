const ActiveProducts = require("../model/activeProductModel")
const Querry = require("../model/querriesModel")
const User=require("../model/userModel")
const jwt = require("jsonwebtoken")
const jwtSecretKey= process.env.JWT_SECRET_KEY
const emailCheck = require("../middleware/nodemailer")

exports.querries = async (req, res) => {

        Querry.find({},{_id:1, name:1, subject:1, completed:1, timeStamp:1},(err, doc) => {
            if (err) res.json({ status: "failed", message: err })
            else {
                res.send({
                    success: doc
                })
            }
        })
}
//email, subject, text,html

exports.userlist = async (req, res) => {
    User.find({},{_id:1, firstName:1, lastName:1, admin:1, email:1},(err, doc) => {
        if (err) res.json({ status: "failed", message: err })
        else {
            res.send({
                success: doc
            })
        }
    })

}

exports.productlist = async (req, res) => {
    ActiveProducts.find({},{_id:1, title:1, creator:1, timeStamp:1, category:1},(err, doc) => {
        if (err) res.json({ status: "failed", message: err })
        else {
            res.send({
                success: doc
            })
        }
    })

}