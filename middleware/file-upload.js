const multer = require('multer');
const uuid = require('uuid/v1');
const File = require('../models/file');
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
         const path = 'uploads/' + req.userData.email + '/';
         cb(null, path);
      },
      filename: (req, file, cb) => {
         const path = 'uploads/' + req.userData.email + '/';
         const fileName = file.originalname;
         cb(null, fileName);
         const createdFile = new File({
            path: path + fileName,
            owner: req.userData.userId,
            creation_date: new Date(),
         });

         createdFile
            .save()
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
