const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    profile_picture :{
        type: String
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