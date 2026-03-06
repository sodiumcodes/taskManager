const mongoose = require("mongoose")
const userSchema = mongoose.Schema({
    profile_picture: {
        type: String,
        default: "https://ik.imagekit.io/sodiumimages/taskManager/users/default.jpg"
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
    phone: {
        type: Number,
        unique: true,
        default : 1234567890,
    },
    password: {
        type: String,
        required: true
    }
}, 
{timestamps: true})

const userModel = mongoose.model("user", userSchema)

module.exports = userModel;