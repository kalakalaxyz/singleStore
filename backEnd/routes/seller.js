const express = require('express');
const Seller = require('../models/seller');
const router = express.Router();
const passport = require('passport');
require('../passport')(passport);

// 全部地址信息
router.post('/seller/find', (req, res) => {
  var obj = {},
      pageSize =  req.body.pageSize || 10,
      currentPage =  req.body.currentPage || 1;
  Seller.find(obj).skip((currentPage-1)*pageSize).limit(pageSize).exec(function (error, docs) {
    if(error){
      res.json({'success': false, 'data': error});
    }else{
      Seller.countDocuments(obj,function(err,result){
        res.json({'success': '查询成功', 'data': docs, 'total': result});
      });
    }
  });
});

router.post('/seller/createAndUpdate', passport.authenticate('bearer', { session: false }), (req, res) => {
  var id = req.body._id;
  var dataObj = {
    storeName: req.body.storeName,
    mainImg: req.body.mainImg,
    distance: req.body.distance,
    sendTime: req.body.sendTime,
    saleNum: req.body.saleNum,
    distribute1: req.body.distribute1,
    distribute2: req.body.distribute2,
    storeImgs: req.body.storeImgs,
    phone: req.body.phone,
    addr: req.body.addr,
    businessTimeFrom: req.body.businessTimeFrom,
    businessTimeTo: req.body.businessTimeTo,
    businessImgs: req.body.businessImgs,
    state: req.body.state,
    rest: req.body.rest
  }
  if(id) {
    Seller.update({_id: id}, {$set: dataObj},function(error, docs){
      if(error){
        res.json({'success': false, 'data': error});
      }else{
        res.json({'success': '修改成功', 'data': docs});
      }
    });
  } else {
    Seller.create(dataObj, function (error, docs) {
      if(error){
        res.json({'success': false, 'data': error});
      }else{
        res.json({'success': '新增成功', 'data': docs});
      }
    });
  }
});

router.post('/seller/delete', passport.authenticate('bearer', { session: false }), (req, res) => {
  var id = req.body._id;
  if(id) {
    Seller.remove({_id: id}, function(error){
      if(error){
        res.json({'success': false, 'data': error});
      }else{
        res.json({'success': '删除成功'});
      }
    })
  } else {
    res.json({'success': false, 'data': '无id'});
  }
});


module.exports = router;
