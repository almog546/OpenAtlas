const express = require('express');
const router = express.Router();
const { createNotifications,getNotifications, markAsRead,markOneAsRead } = require('../controllers/notificationController');


router.get('/', getNotifications);
router.post('/mark-as-read', markAsRead);
router.post('/mark-one-as-read/:id', markOneAsRead);

module.exports = router;