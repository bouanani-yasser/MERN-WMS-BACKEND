const Doc = require('../models/document');
const HttpError = require('../models/http-error');
const fs = require('fs');

const uploadDoc = (req, res) => {
   // const str = JSON.parse(req.body.str);
   // const path = 'uploads/' + req.userData.email + '/';
   const path = 'uploads/file.pdf'; //+ req.file.originalname;
   const createdDoc = new Doc({
      path: path,
      owner: req.userData.userId,
      creation_date: new Date(),
      // structure: str,
   });
   createdDoc
      .save()
      .then((res) => {
         console.log(res);
      })
      .catch((err) => {
         console.log(err);
         const error = new HttpError(
            'Uploading failed, please try again later.',
            500
         );
         return next(error);
      });

   return res.json({
      file: 'file', //req.file.originalname,
   });
};

const getDocs = async (req, res, next) => {
   let Docs = null;
   const userId = req.params.uid;
   try {
      Docs = await Doc.find({ owner: userId });
   } catch (err) {
      const error = new HttpError(
         'Fetching users failed, please try again later.',
         500
      );
      console.log('err' + err);
      return next(error);
   }
   res.json({ Docs: Docs.map((Doc) => Doc.toObject({ getters: true })) });
};

const search = async (req, res, next) => {
   let Docs = null;
   const userId = req.params.uid;
   const query = req.params.query;
   try {
      Docs = await Doc.find({
         owner: userId,
         path: { $regex: query, $options: 'i' },
      });
   } catch (err) {
      const error = new HttpError(
         'Fetching users failed, please try again later.',
         500
      );
      console.log('err' + err);
      return next(error);
   }
   res.json({ Docs: Docs.map((Doc) => Doc.toObject({ getters: true })) });
};

const deleteDoc = async (req, res, next) => {
   const docId = req.params.docid;
   let path = null;
   try {
      // await Doc.findOneAndRemove({ _id: docId });
      const doc = await Doc.findById(docId);
      path = doc.path;
      doc.remove();
      console.log('deleting successfuly completed !!');
   } catch (err) {
      const error = new HttpError(
         'Could not find that Doc, please try again later.',
         500
      );
      console.log('err' + err);
      return next(error);
   }

   fs.unlink(path, (err) => {
      console.log(err);
   });

   res.status(200).json({ message: 'Deleted Doc.' });
};

const downloadDoc = async (req, res, next) => {
   const docId = req.params.docid;
   let doc = null;
   try {
      doc = await Doc.findById(docId);
   } catch (err) {
      const error = new HttpError(
         'Could not find that Doc, please try again later.',
         500
      );
      console.log('err' + err);
      return next(error);
   }
   // fs.readFile(doc.path, (err, data) => {  //reading file like this break the mimory when the files are big
   //    if (err) {
   //       return next(err);
   //    }
   //    res.setHeader('Content-Type', 'application/pdf');
   //    res.setHeader('Content-Disposition', 'inline');
   //    res.send(data);
   // });
   const file = fs.createReadStream(doc.path);
   const filename = doc.path.split('/')[1];
   res.setHeader('Content-Type', 'multipart/form-data');
   res.setHeader('Content-Disposition', 'attachment;filename=' + filename);
   file.pipe(res);
};
exports.getDocs = getDocs;
exports.search = search;
exports.uploadDoc = uploadDoc;
exports.deleteDoc = deleteDoc;
exports.downloadDoc = downloadDoc;
