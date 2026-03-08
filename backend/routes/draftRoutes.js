const express = require('express');
const router = express.Router();

const { getDrafts, getDraftById, createDraft,  deleteDraft } = require('../controllers/draftController');

router.get('/', getDrafts);
router.get('/:id', getDraftById);
router.post('/', createDraft);
router.delete('/:id', deleteDraft);

module.exports = router;
