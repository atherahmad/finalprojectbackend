const mongoose = require('mongoose');

const avatarSchema = new mongoose.Schema({
    img: { data: Buffer, contentType: String }
})
module.exports = mongoose.model("avatars", avatarSchema)