const express = require('express');
const router = express.Router();
const { getPosts,getpostbyid,createPosts,getMyPosts } = require('../controllers/postController');

router.get('/', getPosts);
router.get('/myposts', getMyPosts);
router.get('/:id', getpostbyid);
router.post('/', createPosts);

module.exports = router;