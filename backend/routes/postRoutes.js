const express = require('express');
const router = express.Router();
const { getPosts,getpostbyid,createPosts,getMyPosts,getmypostbyid,deletemyposts,editmyposts,getPostsByAuthorId,
    createComment, getCommentsByPostId, deleteComment,editComment,
    replyToComment,getRepliesByCommentId,getRepliesByPostId,deleteReply,editReply,
    bookMarkpost,unbookmarkpost,getBookmarkedPosts,checkBookmarkStatus,
    addView,
    getTrendingPosts,
    getEditedHistory,getEditedHistoryById,
    adminDeletePost,adminDeleteComment,adminDeleteReply
 } = require('../controllers/postController');

router.get('/', getPosts);
router.get('/myposts', getMyPosts);
router.get('/bookmarks', getBookmarkedPosts);
router.get('/trending', getTrendingPosts);
router.post('/', createPosts);
router.get('/myposts/:id/history', getEditedHistory);
router.get('/myposts/:id/history/:historyId', getEditedHistoryById);
router.get('/myposts/:id', getmypostbyid);
router.delete('/myposts/:id', deletemyposts);
router.put('/myposts/:id', editmyposts);
router.post('/:postId/comments', createComment);
router.get('/:postId/comments', getCommentsByPostId);
router.put('/comments/:id', editComment);
router.delete('/comments/:id', deleteComment);
router.post('/comments/:id/replies', replyToComment);
router.get('/comments/:id/replies', getRepliesByCommentId);
router.get('/:postId/replies', getRepliesByPostId);
router.get('/:id/bookmark/check', checkBookmarkStatus);
router.post('/:id/bookmark', bookMarkpost);
router.delete('/:id/bookmark', unbookmarkpost);
router.get('/:id', getpostbyid);
router.get('/author/:authorId', getPostsByAuthorId);
router.post('/:id/views', addView);
router.delete('/admin/:id', adminDeletePost);
router.delete('/admin/comments/:id', adminDeleteComment);
router.delete('/admin/replies/:id', adminDeleteReply);

module.exports = router;