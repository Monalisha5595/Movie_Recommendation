// This file will contain all the necessary routes required by movie
// importing all the necessay modules required in the file
const express = require('express');
const movieController = require('../controllers/movieController')
const authMiddleware = require('../middleware/authMiddleware')
const router = express.Router();

// Creating Custom Movie Routes
router.post('/create-movie', authMiddleware, movieController.create_movies)
router.get('/get-all-movies', movieController.get_all_movies)
router.get('/get-related-movies', authMiddleware, movieController.get_related_movies)

module.exports = router;