const mongoose = require('mongoose');
const Schema = mongoose.Schema;
/**
* name         名称，      如：张三
* phone        电话        如：15800000000
* addr         地址        如：厦门市软件园二期
* detailAddr   详细地址    如：望海路57号之一7层放外卖桌
* tag          标签        如：0：家 ，1：公司，2：学校
* openid       用户唯一码  如：
* state        使用状态    如：0未使用 1在使用
* delId        删除情况    如：0未删除，1已删除
**/
const AddressSchema = new Schema({
  name: {
    type: String,
    require: true
  },
  phone: {
    type: String,
    require: true
  },
  addr: {
    type: String,
    require: true
  },
  detailAddr: {
    type: String,
    require: true
  },
  tag: {
    type: Number,
    require: true
  },
  openid: {
    type: String,
    require: true
  },
  state: {
    type: Number
  },
  delId: {
    type: Number,
    default: 0 
  }
}, {timestamps: {createdAt: 'created', updatedAt: 'updated'}});
module.exports = mongoose.model('Address', AddressSchema);
