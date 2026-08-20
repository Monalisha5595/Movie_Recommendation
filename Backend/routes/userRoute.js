const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware')

const profile_controller = require("../controllers/userController");

router.post('/update-profile', authMiddleware, profile_controller.update_profile_controller);
router.get('/get-profile', authMiddleware, profile_controller.get_profile_controller)

module.exports = router;