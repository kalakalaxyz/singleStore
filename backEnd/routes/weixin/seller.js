const express = require('express');
const Seller = require('../../models/seller');
const router = express.Router();

//生成base64二维码图片
router.post('/seller/findOne', (req, res) => {
  var obj = {};
  obj.state = 1;
  Seller.findOne(obj).exec(function (error, docs) {
    if(error){
      res.json({'success': false, 'data': error});
    }else{
      res.json({'success': '查询成功', 'data': docs});
    }
  });
});


module.exports = router;
