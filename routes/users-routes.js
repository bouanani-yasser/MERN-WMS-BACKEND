const express = require('express');
const { check } = require('express-validator');

const usersController = require('../controllers/users-controllers');

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
router.post(
   '/add-user',
   [
      check('name').not().isEmpty(),
      check('email').normalizeEmail().isEmail(),
      check('password').isLength({ min: 6 }),
   ],
   usersController.registerUser
);

router.post(
   '/update-user',
   [check('name').not().isEmpty(), check('email').normalizeEmail().isEmail()],
   usersController.updateUser
);

router.post('/login', usersController.login);

router.get('/list/:uid', usersController.getUsersList);
router.delete('/list/:uid', usersController.deleteUser);
router.get('/:uid', usersController.getUserInfo);

module.exports = router;
