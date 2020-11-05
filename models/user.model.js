const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  login: { unique: true, required: true, type: String },
  email: { unique: true, required: true, type: String },
  password: { required: true, type: String },
  favourites: [String],
});

module.exports = mongoose.model('User', userSchema);
