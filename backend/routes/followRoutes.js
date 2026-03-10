const express = require('express');
const router = express.Router();
const { followUser, unfollowUser, getFollowers, getFollowing,checkIfFollowing } = require('../controllers/followController');

router.post('/follow/:id', followUser);
router.delete('/unfollow/:id', unfollowUser);
router.get('/followers/:id', getFollowers);
router.get('/following/:id', getFollowing);
router.get('/check-following/:id', checkIfFollowing);


module.exports = router;