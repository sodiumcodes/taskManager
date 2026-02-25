const taskModel = require("../../models/task.model")

async function createTask (req, res){
    try {
        const task = await taskModel.create(req.body);
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
        const { category, status } = req.query;
        console.log(category, status);
        
        let filter = {};

        if (category) filter.category = category;
        if (status) filter.status = status;

        const tasks = await taskModel.find(filter);

        res.status(200).json({
            count: tasks.length,
            tasks , filter
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
        console.log(req.params)
        await taskModel.findOneAndDelete({
            _id : req.params.id
        })

        res.status(200).json({
            message: "task deleted",
        })
    } catch (err) {
        res.status(500).json({
            message: "Error fetching tasks",
            error: err.message
        });
    }
}

async function updateTask(req,res){
    try {
        await taskModel.findOneAndUpdate({
            _id : req.params.id
        }, {
            status: "Completed"
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