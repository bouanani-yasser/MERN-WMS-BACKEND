const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const userSchema = new Schema({
   name: { type: String, required: true },
   email: { type: String, required: true, unique: true },
   password: { type: String, required: true, minlength: 6 },
   store: [
      (file = {
         path: String,
         creation_date: Date,
         size: Number,
         structure: Schema.Types.Mixed,
      }),
   ],
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
