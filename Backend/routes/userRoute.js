const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware')

const profile_controller = require("../controllers/userController");

router.post('/profile', authMiddleware, profile_controller);

module.exports = router;