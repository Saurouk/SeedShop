const express = require('express');
const router = express.Router();
const likeController = require('../controllers/like.controller');
const auth = require('../middleware/auth');

router.post('/blogs/:id/like', auth, likeController.likeBlog);

module.exports = router;
