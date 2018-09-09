const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const UserSchema = new Schema({
  name: {
    type: String,
    unique: true,
    require: true
  },
  password: {
    type: String,
    require: true
  },
  token: {
    type: String
  }
}, {timestamps: {createdAt: 'created', updatedAt: 'updated'}});
module.exports = mongoose.model('User', UserSchema);
