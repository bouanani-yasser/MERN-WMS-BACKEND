const multer = require('multer');

const fileUpload = multer({
   limits: 500000,
   storage: multer.diskStorage({
      destination: function (req, file, cb) {
         if (file.fieldname === 'str') {
            cb(null, './str');
         } else {
            cb(null, './uploads');
         }
      },
      filename: function (req, file, cb) {
         if (file.fieldname === 'str') {
            cb(null, Date.now() + '-' + file.originalname);
         } else {
            cb(null, file.originalname);
         }
      },
   }),
});

module.exports = fileUpload;
