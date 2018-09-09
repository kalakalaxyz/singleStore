const mongoose = require('mongoose');
const Schema = mongoose.Schema;
/**
* photo       图片      如："/test/img.png"
* name        商品名    如："骨头饭套餐""
* explain     说明      如："味道超好"
* sendNum     月售      如：12345
* totalNum    总销量    如：123450
* praise      好评      如：0.99
* price       价格      如：12
* sellout     售完      如：0未售完，1售完
* delId       删除情况  如：0未删除，1已删除
**/
const GoodsSchema = new Schema({
  photo: {
    type: String,
    require: true
  },
  name: {
    type: String,
    require: true
  },
  explain: {
    type: String,
    require: true
  },
  sendNum: {
    type: Number,
    default: 0 
  },
  totalNum: {
    type: Number,
    default: 0 
  },
  praise: {
    type: Number,
    default: 1 
  },
  price: {
    type: Number,
    require: true
  },
  sellout: {
    type: Number,
    default: 0
  },
  delId: {
    type: Number,
    default: 0 
  }
}, {timestamps: {createdAt: 'created', updatedAt: 'updated'}});
module.exports = mongoose.model('Goods', GoodsSchema);
