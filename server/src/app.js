import express from 'express';
import taskModel from '../models/task.model.js';
const app = express();
app.use(express.json());
app.use(express.urlencoded());
app.post('/create-post', async (req, res)=>{
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
})
app.get('/tasks', async(req,res)=>{
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
})

app.delete('/tasks/:id', async (req,res)=>{
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
})
app.patch('/tasks/:id', async (req, res)=>{
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
            message: "Error fetching tasks",
            error: err.message
        });
    }
})
export default app;