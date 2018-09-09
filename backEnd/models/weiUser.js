const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const WeiUserSchema = new Schema({
  openid: {
    type: String,
    unique: true,
    require: true
  },
  session_key: {
    type: String,
    require: true
  },
  token: {
    type: String
  }
}, {timestamps: {createdAt: 'created', updatedAt: 'updated'}});
module.exports = mongoose.model('WeiUser', WeiUserSchema);
