const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const DocSchema = new Schema({
   path: { type: String, required: true },
   owner: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
   creation_date: Date,
   structure: Array,
});

module.exports = mongoose.model('Document', DocSchema);
