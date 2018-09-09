const express = require('express');
const Order = require('../models/order');
const router = express.Router();
const passport = require('passport');
require('../passport')(passport);
const print = require('./weixin/print.js');
const format = require('../format.js');

// 全部地址信息
router.post('/order/find', passport.authenticate('bearer', { session: false }), (req, res) => {
  var obj = {},
      addrId = req.body.addrId,
      sendTime = req.body.sendTime,
      payType = req.body.payType,
      goods = req.body.goods,
      explain = req.body.explain,
      state = req.body.state,
      arriveTime = req.body.arriveTime,
      openid =  req.body.openid,
      evaluate = req.body.evaluate,
      print = req.body.print,
      printNum = req.body.printNum,
      totalMoney = req.body.totalMoney,
      pageSize =  req.body.pageSize || 10,
      currentPage =  req.body.currentPage || 1;
      if(addrId) {
        obj.addrId = new RegExp(addrId, 'i');
      };
      if(sendTime) {
        obj.sendTime = new RegExp(sendTime, 'i');
      };
      if(state) {
        obj.state = new RegExp(state, 'i');
      };
      if(arriveTime) {
        obj.arriveTime = new RegExp(arriveTime, 'i');
      };
      if(openid) {
        obj.openid = new RegExp(openid, 'i');
      };
      if(evaluate) {
        obj.evaluate = new RegExp(evaluate, 'i');
      };
      if(print) {
        obj.print = new RegExp(print, 'i');
      };
      if(printNum) {
        obj.printNum = new RegExp(printNum, 'i');
      };
  Order.find(obj).sort({'created':-1}).skip((currentPage-1)*pageSize).limit(pageSize).exec(function (error, docs) {
    if(error){
      res.json({'success': false, 'data': error});
    }else{
      Order.countDocuments(obj,function(err,result){
        res.json({'success': '查询成功', 'data': docs, 'total': result});
      });
    }
  });
});

router.post('/order/createAndUpdate', passport.authenticate('bearer', { session: false }), (req, res) => {
  var id = req.body._id,
      dataObj = {
        addrId: req.body.addrId,
        sendTime: req.body.sendTime,
        payType: req.body.payType,
        goods: req.body.goods,
        explain: req.body.explain,
        state: req.body.state,
        arriveTime: req.body.arriveTime,
        openid:  req.body.openid,
        evaluate: req.body.evaluate,
        print: req.body.print,
        printNum: req.body.printNum,
        delId: req.body.delId,
        totalMoney: req.body.totalMoney
      }
      
  if(id) {
    Order.update({_id: id}, {$set: dataObj},function(error, docs){
      if(error){
        res.json({'success': false, 'data': error});
      }else{
        res.json({'success': '修改成功', 'data': docs});
      }
    });
  } else {
    Order.create(dataObj, function (error, docs) {
      if(error){
        res.json({'success': false, 'data': error});
      }else{
        res.json({'success': '新增成功', 'data': docs});
      }
    });
  }
});

router.post('/order/delete', passport.authenticate('bearer', { session: false }), (req, res) => {
  var id = req.body._id;
  if(id) {
    Order.remove({_id: id}, function(error){
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

router.post('/order/print', passport.authenticate('bearer', { session: false }), (req, res) => {
    var _id = req.body._id;
    if(_id) {
      print(req, res, {_id: _id});
    } else {
        res.json({'success': false, 'data': 'E_VALIDATION_SESSION'});
    }
});

router.get('/order/arrive', (req, res) => {
  var id = req.query.id;
  console.log("order id===:  " + id);
  Order.findOne({_id: id}).exec(function (error, docs) {
    if(error){
      res.json({'success': false, 'data': error});
    }else{
      if(docs.state == "已送达"){
        res.json({'success': '查询成功', 'data': docs});
      }else {
        docs.state = "已送达"
        docs.arriveTime = format(new Date(), "yyyy-MM-dd hh:mm:ss");
        docs.save();
        res.json({'success': '查询成功', 'data': docs});
      }
    }
  });
})

module.exports = router;
