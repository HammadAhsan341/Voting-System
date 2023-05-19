const express = require("express");
const router = express.Router();
const {verifyAdmin}= require('../middlewares/auth');
const admin_controller = require("../controllers/AdminController");

//Register Route
router.post('/register_candidate',verifyAdmin,admin_controller.register_candidate);

//Admin_Login Route
router.post('/Login_Admin',admin_controller.Login_Admin);

//candidate delete Route
router.delete('/delete_candidate/:id',verifyAdmin,admin_controller.delete_candidate);

//candidate update Route
router.put('/update_candidate/:id',verifyAdmin,admin_controller.update_candidate);
//candidate display all Route
router.get('/display_candidates',verifyAdmin,admin_controller.display_candidates);

// display result
router.get('/display_result',verifyAdmin,admin_controller.displayResult);

module.exports = router;