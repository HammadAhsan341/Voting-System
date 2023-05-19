const express = require("express");
const router = express.Router();
const user_controller = require("../controllers/userControllers");

const {verifyToken} = require("../middlewares/auth");
//Register Route
router.post('/register',user_controller.register_user);
//Login Route

//Login Route
router.post('/login',user_controller.user_login);
//Profile Route
router.get('/profile',user_controller.userProfile);
// Forget Password Route 
router.post('/forget-password',user_controller.forget_password);

//Reset Password Route
router.put('/reset-password',user_controller.reset_password);
// Send OTP route
router.post('/send-otp',user_controller.send_otp);

// Verify OTP route
router.post('/verify-otp',user_controller.verify_otp);
// Cast vote
router.post("/cast_vote",verifyToken,user_controller.cast_vote);
module.exports = router;