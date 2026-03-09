const express = require('express');
const router = express.Router();
const { getPosts,getpostbyid,createPosts,getMyPosts,getmypostbyid,deletemyposts,editmyposts,
    createComment, getCommentsByPostId, deleteComment,editComment,
    replyToComment,getRepliesByCommentId,deleteReply,editReply,
    bookMarkpost,unbookmarkpost,getBookmarkedPosts
 } = require('../controllers/postController');

router.get('/', getPosts);
router.get('/myposts', getMyPosts);
router.get('/:id', getpostbyid);
router.post('/', createPosts);
router.get('/myposts/:id', getmypostbyid);
router.delete('/myposts/:id', deletemyposts);
router.put('/myposts/:id', editmyposts);
router.post('/:postId/comments', createComment);
router.get('/:postId/comments', getCommentsByPostId);
router.put('/comments/:id', editComment);
router.delete('/comments/:id', deleteComment);
router.post('/comments/:id/replies', replyToComment);
router.get('/comments/:id/replies', getRepliesByCommentId);
router.post('/:id/bookmark', bookMarkpost);
router.delete('/:id/bookmark', unbookmarkpost);
router.get('/bookmarks', getBookmarkedPosts);



module.exports = router;