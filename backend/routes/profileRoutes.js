const express = require('express');
const router = express.Router();

const { getMyProfile, updateMyProfile, createMyProfile } = require('../controllers/profileController');

router.get('/', getMyProfile);
router.put('/', updateMyProfile);
router.post('/', createMyProfile);

module.exports = router;