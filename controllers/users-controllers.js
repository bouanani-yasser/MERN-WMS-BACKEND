// var fs = require('fs');

const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const HttpError = require('../models/http-error');
const User = require('../models/user');

const signup = async (req, res, next) => {
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
      return next(
         new HttpError('Invalid inputs passed, please check your data.', 422)
      );
   }

   const { name, email, password } = req.body;

   let existingUser;
   try {
      existingUser = await User.findOne({ email: email });
   } catch (err) {
      const error = new HttpError(
         'Signing up failed, please try again later.',
         500
      );
      return next(error);
   }

   if (existingUser) {
      const error = new HttpError(
         'User exists already, please login instead.',
         422
      );
      return next(error);
   }

   let hashedPassword;
   try {
      hashedPassword = await bcrypt.hash(password, 12);
   } catch (err) {
      const error = new HttpError(
         'Could not create user, please try again.',
         500
      );
      return next(error);
   }

   const createdUser = new User({
      name,
      role: 'admin',
      email,
      password: hashedPassword,
   });

   try {
      await createdUser.save();
   } catch (err) {
      const error = new HttpError(
         'Signing up failed, please try again later.',
         500
      );
      return next(error);
   }

   let token;
   try {
      token = jwt.sign(
         { userId: createdUser.id, email: createdUser.email },
         'supersecret_dont_share',
         { expiresIn: '1h' }
      );
   } catch (err) {
      const error = new HttpError(
         'Signing up failed, please try again later.',
         500
      );
      return next(error);
   }

   // let dir = './uploads/' + createdUser.email;
   // if (!fs.existsSync(dir)) {
   //    fs.mkdirSync(dir);
   // }
   res.status(201).json({
      userId: createdUser.id,
      email: createdUser.email,
      role: createdUser.role,
      token: token,
   });
};

const registerUser = async (req, res, next) => {
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
      return next(
         new HttpError('Invalid inputs passed, please check your data.', 422)
      );
   }

   const { administrator, name, email, password, role } = req.body;

   let existingUser;
   try {
      existingUser = await User.findOne({ email: email });
   } catch (err) {
      const error = new HttpError(
         'Signing up failed, please try again later.',
         500
      );
      return next(error);
   }

   if (existingUser) {
      const error = new HttpError(
         'User exists already, please login instead.',
         422
      );
      return next(error);
   }

   let hashedPassword;
   try {
      hashedPassword = await bcrypt.hash(password, 12);
   } catch (err) {
      const error = new HttpError(
         'Could not create user, please try again.',
         500
      );
      return next(error);
   }

   const createdUser = new User({
      name,
      role,
      email,
      password: hashedPassword,
      administrator,
   });

   try {
      await createdUser.save();
   } catch (err) {
      const error = new HttpError(
         'Signing up failed, please try again later.',
         500
      );
      return next(error);
   }

   res.status(201).json({
      userId: createdUser.id,
      email: createdUser.email,
      role: createdUser.role,
   });
};

const login = async (req, res, next) => {
   const { email, password } = req.body;

   let existingUser;

   try {
      existingUser = await User.findOne({ email: email });
   } catch (err) {
      const error = new HttpError(
         'Logging in failed, please try again later.',
         500
      );
      return next(error);
   }

   if (!existingUser) {
      const error = new HttpError(
         'Invalid credentials, could not log you in.',
         403
      );
      return next(error);
   }

   let isValidPassword = false;
   try {
      isValidPassword = await bcrypt.compare(password, existingUser.password);
   } catch (err) {
      const error = new HttpError(
         'Could not log you in, please check your credentials and try again.',
         500
      );
      return next(error);
   }

   if (!isValidPassword) {
      const error = new HttpError(
         'Invalid credentials, could not log you in.',
         403
      );
      return next(error);
   }

   let token;
   try {
      token = jwt.sign(
         { userId: existingUser.id, email: existingUser.email },
         'supersecret_dont_share',
         { expiresIn: '1h' }
      );
   } catch (err) {
      const error = new HttpError(
         'Logging in failed, please try again later.',
         500
      );
      return next(error);
   }

   res.json({
      userId: existingUser.id,
      email: existingUser.email,
      role: existingUser.role,
      token: token,
   });
};

const getUserInfo = async (req, res, next) => {
   let userInfo = null;
   const userId = req.params.uid;
   try {
      userInfo = await User.findById(userId);
   } catch (err) {
      const error = new HttpError(
         'Fetching user Infos failed, please try again later.',
         500
      );
      console.log('err' + err);
      return next(error);
   }
   res.json({ userInfo: userInfo.toObject({ getters: true }) });
};

const getUsersList = async (req, res, next) => {
   let usersList = null;
   const userId = req.params.uid;
   try {
      usersList = await User.find({ administrator: userId });
   } catch (err) {
      const error = new HttpError(
         'Fetching users failed, please try again later.',
         500
      );
      console.log('err' + err);
      return next(error);
   }
   res.json({
      usersList: usersList.map((user) => user.toObject({ getters: true })),
   });
};

const deleteUser = async (req, res, next) => {
   const userId = req.params.uid;
   try {
      await User.findOneAndRemove({ _id: userId });
      console.log('deleting successfully completed !!');
   } catch (err) {
      const error = new HttpError(
         'Could not find that Doc, please try again later.',
         500
      );
      console.log('err' + err);
      return next(error);
   }

   res.status(200).json({ message: 'Deleted User.' });
};

const updateUser = async (req, res) => {
   const { id, name, email, role } = req.body;
   try {
      const user = await User.findById(id);
      user.name = name;
      user.email = email;
      user.role = role === 'user' ? role : 'admin';
      user.save();
   } catch (err) {
      const error = new HttpError(
         'Could not find that Doc, please try again later.',
         500
      );
      console.log('err' + err);
      return next(error);
   }

   res.status(200).json({ message: 'Updated User.' });
};

exports.signup = signup;
exports.login = login;
exports.getUserInfo = getUserInfo;
exports.registerUser = registerUser;
exports.getUsersList = getUsersList;
exports.deleteUser = deleteUser;
exports.updateUser = updateUser;
