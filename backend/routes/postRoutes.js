const express = require('express');
const router = express.Router();
const { getPosts,getpostbyid,createpost } = require('../controllers/postController');

router.get('/', getPosts);
router.get('/:id', getpostbyid);
router.post('/', createpost);
module.exports = router;