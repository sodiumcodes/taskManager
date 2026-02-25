const mongoose = require("mongoose")
require("colors")

//DB connect function
async function Connection(){

    await mongoose.connect(process.env.MONGODB_URI)
    console.log("Database connected successfully".green)

}
module.exports = Connection