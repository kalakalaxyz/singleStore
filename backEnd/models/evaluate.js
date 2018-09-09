const mongoose = require('mongoose');
const Schema = mongoose.Schema;
/**
* sendStar     配送        如：0-4为一到五颗星
* tasteStar    口味        如：
* packStar     包装        如：
* explain      说明        如："味道不错"
* imgs         图片        如：["/test/img.png","/test/img2.png"]
* openid       用户唯一码  如：
* delId        删除情况    如：0未删除，1已删除
**/
const EvaluateSchema = new Schema({
  avatarUrl: {
    type: String
  },
  sendStar: {
    type: Number
  },
  tasteStar: {
    type: Number
  },
  packStar: {
    type: Number
  },
  explain: {
    type: String
  },
  imgs: {
    type: Array
  },
  openid: {
    type: String,
    require: true
  },
  delId: {
    type: Number,
    default: 0 
  }
}, {timestamps: {createdAt: 'created', updatedAt: 'updated'}});
module.exports = mongoose.model('Evaluate', EvaluateSchema);
