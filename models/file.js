const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const fileSchema = new Schema({
   path: String,
   owner: String,
   creation_date: Date,
   size: Number,
   structure: Schema.Types.Mixed,
});

module.exports = mongoose.model('File', fileSchema);
