const mongoose = require('mongoose');
const Schema = mongoose.Schema;
/**
* addrId         地址ID         如：
* sendTime       要求送达时间   如：2018-08-29 11:11:11
* payType        支付方式       如：微信在线支付
* goods          商品列表       如：
    [{
      goodsId: , 商品id   
      num: 2,    商品订购数量
      price: 14  单价
    }]
* totalMoney     总金额         如：42
* explain        说明           如：
* state          状态           如：
* arriveTime     实际送达时间   如：2018-08-29 11:11:11
* openid         用户唯一码     如：
* evaluate       是否已评价     如：0未评 1已评
* print          是否已打印     如：0未打印 1已打印
* printNum       打印次数       如：2
* delId          删除情况       如：0未删除，1已删除
**/
const OrderSchema = new Schema({
  addrId: {
    type: String,
    require: true,
    ref: 'Address'
  },
  sendTime: {
    type: String,
    require: true
  },
  payType: {
    type: String,
    default: "微信在线支付"
  },
  goods: [
    {
      goodsId: {type: String, require: true, ref:'Goods'},
      num: Number,
      price: Number
    }
  ],
  totalMoney: {
    type: Number,
    default: 0
  },
  explain: {
    type: String
  },
  state: {
    type: String,
    require: true
  },
  arriveTime: {
    type: Date
  },
  openid: {
    type: String,
    require: true
  },
  evaluate: {
    type: Number,
    default: 0
  },
  print: {
    type: Number,
    default: 0
  },
  printNum: {
    type: Number,
    default: 0
  },
  delId: {
    type: Number,
    default: 0 
  }
}, {timestamps: {createdAt: 'created', updatedAt: 'updated'}});
module.exports = mongoose.model('Order', OrderSchema);
