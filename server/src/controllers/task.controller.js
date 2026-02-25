const taskModel = require("../../models/task.model")

async function createTask (req, res){
    try {
        //Collect data 
        const {title, category, status, priority} = req.body;

        //Validate data
        if(!title || !category || !status || !priority){
            return res.status(400).json({
                message: "All fields are required"
            })
        }

        //Create task
        const task = await taskModel.create({
            title, category, status, priority
        });

        //send response
        res.status(201).json({
            message: "Task created",
            task
        });
    } catch (err) {
        res.status(500).json({
            message: "Error creating task",
            error: err.message
        });
    }
}

async function getTasks(req,res){
    try {    
        const tasks = await taskModel.find(filter);

        res.status(200).json({
            count: tasks.length,
            tasks
        });

    } catch (err) {
        res.status(500).json({
            message: "Error fetching tasks",
            error: err.message
        });
    }
}

async function deleteTask(req,res){
    try {
        await taskModel.findOneAndDelete({
            _id : req.params.id
        })

        res.status(200).json({
            message: "task deleted",
        })
    } catch (err) {
        res.status(500).json({
            message: "Error deleting task",
            error: err.message
        });
    }
}

async function updateTask(req,res){
    try {
        //Collect data
        const {title,category,status,priority} = req.body;

        await taskModel.findOneAndUpdate({
            _id : req.params.id
        }, {
            title, category, status, priority
        })
        res.status(200).json({
            message: "task updated",
        })
    } catch (err) {
        res.status(500).json({
            message: "Error while updating tasks",
            error: err.message
        });
    }
}


module.exports = {createTask, getTasks, deleteTask, updateTask}