const express = require('express');
const router = express.Router();

const { getMyProfile, updateMyProfile, createMyProfile,otherPeopleProfile,profileposts } = require('../controllers/profileController');

router.get('/', getMyProfile);
router.put('/', updateMyProfile);
router.post('/', createMyProfile);
router.get('/:id', otherPeopleProfile);
router.get('/:id/posts', profileposts);
module.exports = router;