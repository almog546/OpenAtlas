const express = require('express');
const router = express.Router();

const { getDrafts, getDraftById, createDraft,  deleteDraft,editdrfat } = require('../controllers/draftController');

router.get('/', getDrafts);
router.get('/:id', getDraftById);
router.post('/', createDraft);
router.delete('/:id', deleteDraft);
router.put('/:id', editdrfat);


module.exports = router;
