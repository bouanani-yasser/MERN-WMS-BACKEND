const multer = require('multer');
const uuid = require('uuid/v1');

// const MIME_TYPE_MAP = {
//    'image/png': 'png',
//    'image/jpeg': 'jpeg',
//    'image/jpg': 'jpg',
// };

const fileUpload = multer({
   limits: 500000,
   storage: multer.diskStorage({
      destination: (req, file, cb) => {
         cb(null, 'uploads/');
      },
      filename: (req, file, cb) => {
         console.log(file.mimetype);
         cb(null, uuid() + '.' + file.mimetype.split('/')[1].split('+')[0]);
      },
   }),
   //  fileFilter: (req, file, cb) => {
   //     const isValid = !!MIME_TYPE_MAP[file.mimetype];
   //     let error = isValid ? null : new Error('Invalid mime type!');
   //     cb(error, isValid);
   //  },
});

module.exports = fileUpload;
