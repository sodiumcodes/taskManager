const uploadPfp = require("../controllers/user.controller");
const protectRoute = require("../middlewares/auth.middleware");
const upload = require("../middlewares/upload.middleware")
const router = require("express").Router()

router.post('/profile-picture', protectRoute,upload.single("profile_picture"), uploadPfp)

module.exports = router;