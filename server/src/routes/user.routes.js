const { uploadPfp, phone, updateName, getuserDetails, changeEmail, updatePassword } = require("../controllers/user.controller");
const protectRoute = require("../middlewares/auth.middleware");
const upload = require("../middlewares/upload.middleware")
const router = require("express").Router()

router.post('/profile-picture', protectRoute, upload.single("profile_picture"), uploadPfp)
router.post('/phone', protectRoute, phone)
router.patch('/name', protectRoute, updateName)
router.get('/details', protectRoute, getuserDetails)
router.patch("/change-email", protectRoute, changeEmail)
router.patch("/change-password", protectRoute, updatePassword)

module.exports = router;