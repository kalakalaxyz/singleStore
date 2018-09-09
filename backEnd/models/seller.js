const mongoose = require('mongoose');
const Schema = mongoose.Schema;
/**
* storeName         店名            如："美滋滋"
* mainImg           主图            如："/test/img.png""
* distance          距离            如："500"
* sendTime          送达时间        如：30
* saleNum           月售            如：1234
* distribute1       配送信息1       如：商家自配送
* distribute2       配送信息2       如："免配送费"
* storeImgs         店铺图片        如：["/test/img.png","/test/img2.png"]
* phone             手机号          如：15812345678
* addr              地址            如：厦门上市软件园二期
* businessTimeFrom  营业时间起      如：09：00
* businessTimeTo    营业时间止      如：11：00
* businessImgs      营业资质图片    如：["/test/img.png","/test/img2.png"]
* state             状态            如：0未处于使用，1处于使用
* rest              休息中          如：0未休息，1休息中
**/
const SellerSchema = new Schema({
  storeName: {
    type: String
  },
  mainImg: {
    type: String
  },
  distance: {
    type: String
  },
  sendTime: {
    type: String
  },
  saleNum: {
    type: Number
  },
  distribute1: {
    type: String
  },
  distribute2: {
    type: String
  },
  storeImgs: {
    type: Array
  },
  phone: {
    type: String
  },
  addr: {
    type: String
  },
  businessTimeFrom: {
    type: String
  },
  businessTimeTo: {
    type: String
  },
  businessImgs: {
    type: Array
  },
  state: {
    type: Number,
    default: 0
  },
  rest: {
    type: Number,
    default: 0
  }
}, {timestamps: {createdAt: 'created', updatedAt: 'updated'}});
module.exports = mongoose.model('Seller', SellerSchema);
