// This file contans all the authentication related routes
// importing all the necessary modules required in this file
const express = require('express')
const router = express.Router();
const userController = require('../controllers/authController');


router.post('/signup', userController.signup_controller);
router.post('/signin', userController.signin_controller);


module.exports = router;