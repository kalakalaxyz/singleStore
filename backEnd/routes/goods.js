const express = require('express');
const Goods = require('../models/goods');
const router = express.Router();
const passport = require('passport');
require('../passport')(passport);

router.post('/goods/find', (req, res) => {
  var obj = {},
      pageSize =  req.body.pageSize || 10,
      currentPage =  req.body.currentPage || 1;
  Goods.find(obj).sort({'sellout': 1, 'created':-1}).skip((currentPage-1)*pageSize).limit(pageSize).exec(function (error, docs) {
    if(error){
      res.json({'success': false, 'data': error});
    }else{
      Goods.countDocuments(obj,function(err,result){
        res.json({'success': '查询成功', 'data': docs, 'total': result});
      });
    }
  });
});
router.post('/goods/findAll', (req, res) => {
  var obj = {};
  Goods.find(obj).exec(function (error, docs) {
    if(error){
      res.json({'success': false, 'data': error});
    }else{
      res.json({'success': '查询成功', 'data': docs});
    }
  });
});

router.post('/goods/createAndUpdate', passport.authenticate('bearer', { session: false }), (req, res) => {
  var id = req.body._id;
  var dataObj = {
      name: req.body.name,
      explain: req.body.explain,
      sendNum: req.body.sendNum,
      totalNum: req.body.totalNum,
      praise: req.body.praise,
      price: req.body.price,
      photo: req.body.photo,
      sellout: req.body.sellout,
      delId: req.body.delId
  }
  if(id) {
    Goods.update({_id: id}, {$set: dataObj},function(error, docs){
      if(error){
        res.json({'success': false, 'data': error});
      }else{
        res.json({'success': '修改成功', 'data': docs});
      }
    });
  } else {
    Goods.create(dataObj, function (error, docs) {
      if(error){
        res.json({'success': false, 'data': error});
      }else{
        res.json({'success': '新增成功', 'data': docs});
      }
    });
  }
});

router.post('/goods/delete', passport.authenticate('bearer', { session: false }), (req, res) => {
  var id = req.body._id;
  if(id) {
    Goods.remove({_id: id}, function(error){
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
