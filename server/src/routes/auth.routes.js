const router = require("express").Router()
const authController = require("../controllers/auth.controller")
const protectRoute = require("../middlewares/auth.middleware")

router.post("/register", authController.register)
router.post("/login", authController.login)
router.get("/me", protectRoute, authController.me)

module.exports = router;