const mongoose = require("mongoose")
const image = require("../public/images/default.png")
const userSchema = mongoose.Schema({
    profile_picture: {
        type: String,
        default: image
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
})

const userModel = mongoose.model("user", userSchema)

module.exports = userModel;