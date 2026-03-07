const postController = require("../controllers/task.controller")
const protectRoute = require("../middlewares/auth.middleware")
const router = require("express").Router()

router.post("/create-task", protectRoute, postController.createTask)
router.get("/get-tasks", protectRoute, postController.getTasks)
router.delete("/delete-task/:id", protectRoute, postController.deleteTask)
router.patch("/update-task/:id", protectRoute, postController.updateTask)
router.patch("/update-status/:id", protectRoute, postController.updateStatus)
router.get("/filter-task", protectRoute, postController.filterTask)
router.get("/stats", protectRoute, postController.getStats)
router.post("/add-subtask/:taskId/subtask", protectRoute, postController.addSubtask)
router.patch("/update-subtask/:taskId/subtask/:subtaskId", protectRoute, postController.updateSubtask)
router.delete("/delete-subtask/:taskId/subtask/:subtaskId", protectRoute, postController.deleteSubtask)

module.exports = router