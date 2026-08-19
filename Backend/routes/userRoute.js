const express = require('express');
const router = express.Router();

const profile_controller = require("../controllers/userController");

router.post('/profile', profile_controller);

module.exports = router;