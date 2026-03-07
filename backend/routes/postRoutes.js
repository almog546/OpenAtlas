const express = require('express');
const router = express.Router();
const { getPosts,getpostbyid,createPosts } = require('../controllers/postController');

router.get('/', getPosts);
router.get('/:id', getpostbyid);
router.post('/', createPosts);

module.exports = router;