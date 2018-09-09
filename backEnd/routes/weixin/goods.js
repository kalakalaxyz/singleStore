const express = require('express');
const Goods = require('../../models/goods');
const router = express.Router();

//查找全部商品
router.post('/goods/find', (req, res) => {
  var obj = {delId: 0};
  Goods.find(obj).sort({'sellout': 1, 'created':-1}).exec(function (error, docs) {
    if(error){
      res.json({'success': false, 'data': error});
    }else{
      console.log(docs);
      Goods.countDocuments(obj,function(err,result){

        res.json({'success': '查询成功', 'data': docs, 'total': result});
      });
    }
  });
});


module.exports = router;
