import mongoose from 'mongoose'
const taskScehma = mongoose.Schema({
    title: String,
    category: {
        type: String,
        enum: ["Study", "Work", "Personal"]
    },
    status: {
        type: String,
        enum: ["Pending", "Completed"],
        default: "Pending"
    },
    priority: {
        type: String,
        enum: ["Low", "Medium", "High"]
    }
})
const taskModel = mongoose.model("task", taskScehma);
export default taskModel;