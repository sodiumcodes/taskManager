const taskModel = require("../../models/task.model");
const userModel = require("../../models/user.model");

async function createTask(req, res) {
    try {
        //Collect data 
        const { title, description, category, status, priority, dueDate } = req.body;
        const userId = req.user?.id;

        //Validate data
        if (!title || !category || !status || !priority) {
            return res.status(400).json({
                message: "All fields are required"
            })
        }

        if (!userId) {
            return res.status(401).json({
                message: "User not authenticated"
            })
        }

        //Create task
        const task = await taskModel.create({
            title, description, category, status, priority, user: userId, dueDate
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

async function getTasks(req, res) {
    try {
        const userId = req.user.id;

        if (!userId) {
            return res.status(401).json({
                message: "User not authenticated"
            })
        }

        const { sortBy, order } = req.query;
        const sortOrder = order === 'asc' ? 1 : -1;

        // Priority and status need custom sort since they're strings
        const priorityOrder = { High: 1, Medium: 2, Low: 3 };
        const statusOrder = { 'Not Started': 1, Pending: 2, Completed: 3 };

        let tasks;

        if (sortBy === 'priority' || sortBy === 'status') {
            // Fetch all then sort in memory for custom ordering
            tasks = await taskModel.find({ user: userId });
            const orderMap = sortBy === 'priority' ? priorityOrder : statusOrder;
            tasks.sort((a, b) => {
                const aVal = orderMap[a[sortBy]] || 99;
                const bVal = orderMap[b[sortBy]] || 99;
                return (aVal - bVal) * sortOrder;
            });
        } else if (sortBy) {
            // MongoDB sort for date fields
            tasks = await taskModel.find({ user: userId }).sort({ [sortBy]: sortOrder });
        } else {
            // Default: newest first
            tasks = await taskModel.find({ user: userId }).sort({ createdAt: -1 });
        }

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

async function deleteTask(req, res) {
    try {
        await taskModel.findOneAndDelete({
            _id: req.params.id
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

async function updateTask(req, res) {
    try {
        //Collect data
        const { title, description, category, status, priority, dueDate } = req.body;

        await taskModel.findOneAndUpdate({
            _id: req.params.id
        }, {
            title, description, category, status, priority, dueDate
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

async function updateStatus(req, res) {
    try {
        const { status } = req.body;

        await taskModel.findOneAndUpdate({
            _id: req.params.id
        }, {
            status
        })
        res.status(200).json({
            message: "task status updated",
        })
    } catch (err) {
        res.status(500).json({
            message: "Error while updating task status",
            error: err.message
        });
    }
}
const filterTask = async (req, res) => {
    try {
        const filter = {
            user: req.user.id,
            ...req.body //destructuring
        }

        const tasks = await taskModel.find(filter);
        res.status(200).json({
            message: "tasks filtered",
            tasks
        })

    }
    catch (err) {
        res.status(500).json({
            message: "Error while filtering",
            error: err.message
        })
    }
}
async function getStats(req, res) {
    try {
        const id = req.user.id;

        if (!id) {
            return res.status(401).json({
                message: "User not authenticated"
            })
        }

        const status = await taskModel.aggregate([
            { $match: { user: id } },
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 }
                }
            }
        ])

        return res.status(200).json({
            message: "Stats fetched successfully",
            status
        })
    } catch (error) {
        console.log(error)
        return res.status(401).json({
            message: "Error while fetching stats",
            error
        })
    }
}

async function addSubtask(req, res) {
    try {
        const { title } = req.body;
        const task = await taskModel.findOneAndUpdate({
            _id: req.params.taskId
        }, {
            $push: {
                subtasks: { title }
            }
        }, { new: true })
        res.status(200).json({
            message: "subtask added",
            task
        })
    } catch (err) {
        res.status(500).json({
            message: "Error while adding subtask",
            error: err.message
        })
    }
}

async function updateSubtask(req, res) {
    try {
        const { taskId, subtaskId } = req.params;
        const { done } = req.body;
        const task = await taskModel.findOneAndUpdate({
            _id: taskId
        }, {
            $set: {
                "subtasks.$[subtask].done": done
            }
        }, { new: true, arrayFilters: [{ "subtask._id": subtaskId }] })
        res.status(200).json({
            message: "subtask updated",
            task
        })
    } catch (err) {
        res.status(500).json({
            message: "Error while updating subtask",
            error: err.message
        })
    }
}

async function deleteSubtask(req, res) {
    try {
        const { taskId, subtaskId } = req.params;
        const task = await taskModel.findOneAndUpdate({
            _id: taskId
        }, {
            $pull: {
                subtasks: { _id: subtaskId }
            }
        }, { new: true })
        res.status(200).json({
            message: "subtask deleted",
            task
        })
    } catch (err) {
        res.status(500).json({
            message: "Error while deleting subtask",
            error: err.message
        })
    }
}

module.exports =
{
    createTask,
    getTasks,
    deleteTask,
    updateTask,
    updateStatus,
    filterTask,
    getStats,
    addSubtask,
    updateSubtask,
    deleteSubtask
}
