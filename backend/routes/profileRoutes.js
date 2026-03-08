const express = require('express');
const router = express.Router();

const { getProfile, updateProfile, createProfile } = require('../controllers/profileController');

router.get('/', getProfile);
router.put('/', updateProfile);
router.post('/', createProfile);

module.exports = router;