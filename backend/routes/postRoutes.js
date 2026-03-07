const express = require('express');
const router = express.Router();
const { getPosts,getpostbyid } = require('../controllers/postController');

router.get('/', getPosts);
router.get('/:id', getpostbyid);
module.exports = router;