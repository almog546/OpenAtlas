const express = require('express');
const router = express.Router();

const { createReportPost,createReportComment, getReports, deleteReport } = require('../controllers/reportController');


router.post('/post', createReportPost);
router.post('/comment', createReportComment);
router.get('/', getReports);
router.delete('/:id', deleteReport);

module.exports = router;