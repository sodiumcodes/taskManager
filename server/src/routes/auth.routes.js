const router = require("express").Router()
const authController = require("../controllers/auth.controller")
const { logout } = require("../controllers/auth.controller")

router.post("/register", authController.register)
router.post("/login", authController.login)
router.post('/logout', logout )
module.exports = router;