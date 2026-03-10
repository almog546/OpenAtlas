const express = require('express');
const router = express.Router();
const { followUser, unfollowUser, getFollowers,  getMyFollowing, checkIfFollowing } = require('../controllers/followController');

router.post('/follow/:id', followUser);
router.delete('/unfollow/:id', unfollowUser);
router.get('/followers', getFollowers);
router.get('/following', getMyFollowing);
router.get('/check-following/:id', checkIfFollowing);


module.exports = router;