const express = require('express');
const { check } = require('express-validator');

const usersController = require('../controllers/users-controllers');
const fileUpload = require('../middleware/file-upload');
const checkAuth = require('../middleware/check-auth');
const User = require('../models/user');

const router = express.Router();

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

router.use(checkAuth);

router.post('/upload', fileUpload.single('file'), (req, res) => {
   return res.json({ file: req.file.originalname });
});

module.exports = router;
