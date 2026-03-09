const express = require('express');
const router = express.Router();
const { getPosts,getpostbyid,createPosts,getMyPosts,getmypostbyid,deletemyposts,editmyposts,createComment, getCommentsByPostId, deleteComment,editComment } = require('../controllers/postController');

router.get('/', getPosts);
router.get('/myposts', getMyPosts);
router.get('/:id', getpostbyid);
router.post('/', createPosts);
router.get('/myposts/:id', getmypostbyid);
router.delete('/myposts/:id', deletemyposts);
router.put('/myposts/:id', editmyposts);
router.post('/comment', createComment);
router.get('/comment/post/:postId', getCommentsByPostId);
router.delete('/comment/:id', deleteComment);
router.put('/comment/:id', editComment);


module.exports = router;