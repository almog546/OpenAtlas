const express = require('express');
const router = express.Router();

const { signup,login,me,logout,getAllUsers } = require('../controllers/authController');

router.post('/signup', signup);
router.post('/login', login);
router.get('/me', me);
router.post('/logout', logout);
router.get('/users', getAllUsers);

module.exports = router; 