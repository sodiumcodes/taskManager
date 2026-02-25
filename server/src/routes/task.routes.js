const postController = require("../controllers/post.controller")
const router = require("express").Router()

router.post("/create-task", postController.createTask)
router.get("/get-tasks", postController.getTasks)
router.delete("/delete-task/:id", postController.deleteTask)
router.patch("/update-task/:id", postController.updateTask)

module.exports = router