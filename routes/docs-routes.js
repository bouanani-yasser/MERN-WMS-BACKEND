const express = require('express');
const fileUpload = require('../middleware/file-upload');
const checkAuth = require('../middleware/check-auth');

const docsController = require('../controllers/docs-controllers');

const router = express.Router();

router.get('/list/:uid', docsController.getDocs);
router.get('/download/:docid', docsController.downloadDoc);
router.get('/search/:uid/:query', docsController.search);

router.use(checkAuth);

router.delete('/remove/:docid', docsController.deleteDoc);

router.post(
   '/upload',
   fileUpload.fields([
      { name: 'doc', maxCount: 1 },
      { name: 'str', maxCount: 1 },
   ]),
   docsController.uploadDoc
);

router.patch(
   '/update/:docid',
   fileUpload.single('str'),
   docsController.updateDoc
);

module.exports = router;
