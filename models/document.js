const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DocSchema = new Schema({
   path: String,
   owner: String,
   creation_date: Date,
   structure: Array,
});

module.exports = mongoose.model('Document', DocSchema);
