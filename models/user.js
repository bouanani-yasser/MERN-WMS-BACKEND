const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const userSchema = new Schema({
   name: { type: String, required: true },
   role: { type: String },
   email: { type: String, required: true, unique: true },
   password: { type: String, required: true, minlength: 6 },
   administrator: { type: mongoose.Types.ObjectId, ref: 'User' },
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
