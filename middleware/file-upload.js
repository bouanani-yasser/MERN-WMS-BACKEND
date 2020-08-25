const multer = require('multer');
const uuid = require('uuid/v1');
const User = require('../models/user');
const fs = require('fs');

// const MIME_TYPE_MAP = {
//    'image/png': 'png',
//    'image/jpeg': 'jpeg',
//    'image/jpg': 'jpg',
// };

const fileUpload = multer({
   limits: 500000,
   storage: multer.diskStorage({
      destination: (req, file, cb) => {
         cb(null, 'uploads/' + req.userData.email + '/');
      },
      filename: (req, file, cb) => {
         const fileName = uuid() + '_' + file.originalname;
         cb(null, fileName);
         User.findById(req.userData.userId)
            .then((user) => {
               user.store.push({
                  path: '/uploads/' + req.userData.email + '/' + fileName,
                  creation_date: Date(),
                  structure: { type: 'png' },
               });

               return user.save();
            })
            .then((res) => {
               console.log(res);
            })
            .catch((err) => {
               console.log(err);
            });
      },
   }),
   //  fileFilter: (req, file, cb) => {
   //     const isValid = !!MIME_TYPE_MAP[file.mimetype];
   //     let error = isValid ? null : new Error('Invalid mime type!');
   //     cb(error, isValid);
   //  },
});

module.exports = fileUpload;
