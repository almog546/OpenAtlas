const express = require('express');
const router = express.Router();

const { createComment, getCommentsByPostId, deleteComment,editComment } = require('../controllers/commentController');

router.post('/', createComment);
router.get('/post/:postId', getCommentsByPostId);
router.delete('/:id', deleteComment);
router.put('/:id', editComment);

module.exports = router;