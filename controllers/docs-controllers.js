const Doc = require('../models/document');
const fs = require('fs'),
   xml2js = require('xml2js');
const HttpError = require('../models/http-error');

const uploadDoc = async (req, res, next) => {
   const desc = req.body.desc;
   const path = 'uploads/' + req.files.doc[0].originalname;
   let jsonResult;
   const parser = new xml2js.Parser();
   if (req.files.str) {
      fs.readFile(req.files.str[0].path, function (err, data) {
         parser.parseString(data, function (err, result) {
            jsonResult = JSON.stringify(result);
            const createdDoc = new Doc({
               path: path,
               owner: req.userData.userId,
               creation_date: new Date(),
               description: desc,
               structures: jsonResult,
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
               file: req.files.doc[0].originalname,
            });
         });
      });
   } else {
      const createdDoc = new Doc({
         path: path,
         owner: req.userData.userId,
         creation_date: new Date(),
         description: desc,
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
         file: req.files.doc[0].originalname,
      });
   }
};

const updateDoc = async (req, res, next) => {
   const parser = new xml2js.Parser();
   const docId = req.params.docid;
   const desc = req.body.desc;
   if (req.file) {
      fs.readFile(req.file.path, function (err, data) {
         parser.parseString(data, async function (err, result) {
            let str = JSON.stringify(result);
            try {
               const doc = await Doc.findById(docId);
               doc.description = desc;
               doc.structures.push(str);
               doc.save();
               console.log('updating successfully completed !!');
            } catch (err) {
               const error = new HttpError(
                  'Could not find that Doc, please try again later.',
                  500
               );
               console.log('err' + err);
               return next(error);
            }

            res.status(200).json({ message: 'Updated Doc.' });
         });
      });
   } else {
      try {
         const doc = await Doc.findById(docId);
         doc.description = desc;
         doc.save();
         console.log('updating successfully completed !!');
      } catch (err) {
         const error = new HttpError(
            'Could not find that Doc, please try again later.',
            500
         );
         console.log('err' + err);
         return next(error);
      }

      res.status(200).json({ message: 'Updated Doc.' });
   }
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
      }).or([
         { description: { $regex: query, $options: 'i' } },
         { structures: { $elemMatch: { $regex: query, $options: 'i' } } },
      ]);
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
      console.log('deleting successfully completed !!');
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

   file.on('error', (err) => {
      return next(err);
   });

   file.on('open', () => {
      const filename = doc.path.split('/')[1];
      res.setHeader('Content-Type', 'multipart/form-data');
      res.setHeader('Content-Disposition', 'attachment;filename=' + filename);
      file.pipe(res);
   });
};
exports.getDocs = getDocs;
exports.search = search;
exports.uploadDoc = uploadDoc;
exports.deleteDoc = deleteDoc;
exports.downloadDoc = downloadDoc;
exports.updateDoc = updateDoc;
