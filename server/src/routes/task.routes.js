const postController = require("../controllers/task.controller")
const protectRoute = require("../middlewares/auth.middleware")
const router = require("express").Router()

router.post("/create-task", protectRoute, postController.createTask)
router.get("/get-tasks", protectRoute, postController.getTasks)
router.delete("/delete-task/:id", protectRoute, postController.deleteTask)
router.patch("/update-task/:id", protectRoute, postController.updateTask)

module.exports = router