const multer = require('multer');
// const uuid = require('uuid/v1');

// const MIME_TYPE_MAP = {
//    'image/png': 'png',
//    'image/jpeg': 'jpeg',
//    'image/jpg': 'jpg',
// };

const fileUpload = multer({
   limits: 500000,
   storage: multer.diskStorage({
      destination: (req, file, cb) => {
         // const path = 'uploads/' + req.userData.email + '/';
         const path = 'uploads/';
         cb(null, path);
      },
      filename: (req, file, cb) => {
         const fileName = file.originalname;
         req.filename = fileName;
         cb(null, fileName);
      },
   }),
   //  fileFilter: (req, file, cb) => {
   //     const isValid = !!MIME_TYPE_MAP[file.mimetype];
   //     let error = isValid ? null : new Error('Invalid mime type!');
   //     cb(error, isValid);
   //  },
});

module.exports = fileUpload;
