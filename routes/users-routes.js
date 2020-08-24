const express = require('express');
const { check } = require('express-validator');

const usersController = require('../controllers/users-controllers');
const fileUpload = require('../middleware/file-upload');

// var multer = require('multer');
// var upload = multer({ dest: 'uploads/' });

const router = express.Router();

// router.get('/', usersController.getUsers);

router.post('/upload', fileUpload.single('file'), (req, res, next) => {
   res.json({ file: req.file.originalname });
   next();
});
router.post(
   '/signup',
   [
      check('name').not().isEmpty(),
      check('email').normalizeEmail().isEmail(),
      check('password').isLength({ min: 6 }),
   ],
   usersController.signup
);

router.post('/login', usersController.login);

module.exports = router;
