const express = require('express');
const fileUpload = require('../middleware/file-upload');
const checkAuth = require('../middleware/check-auth');

const docsController = require('../controllers/docs-controllers');

const router = express.Router();

router.get('/:uid', docsController.getDocs);
router.get('/download/:docid', docsController.downloadDoc);
router.get('/search/:uid/:query', docsController.search);

// router.use(checkAuth);

router.delete('/remove/:docid', docsController.deleteDoc);

router.post('/upload', fileUpload.single('file'), docsController.uploadDoc);

module.exports = router;
