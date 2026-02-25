const mongoose = require("mongoose")
const taskScehma = mongoose.Schema({
    title: {
        type : String,
        required : true
    },
    category: {
        type: String,
        enum: ["Study", "Work", "Personal"],
        default : "Personal",
        required : true
    },
    status: {
        type: String,
        enum: ["Not Started","Pending", "Completed"],
        default: "Not Started",
        required : true
    },
    priority: {
        type: String,
        enum: ["Low", "Medium", "High"],
        default : "Low",
        required : true
    }
})
const taskModel = mongoose.model("task", taskScehma);
module.exports = taskModel;