const express = require('express');
const Address = require('../models/address');
const router = express.Router();
const passport = require('passport');
require('../passport')(passport);

// 全部地址信息
router.post('/address/find', passport.authenticate('bearer', { session: false }), (req, res) => {
  var obj = {},
      _id = req.body._id,
      name = req.body.name,
      phone = req.body.phone,
      addr = req.body.addr,
      detailAddr = req.body.detailAddr,
      openid =  req.body.openid,
      state = req.body.state,
      pageSize =  req.body.pageSize || 10,
      currentPage =  req.body.currentPage || 1;
      if(_id) {
        obj._id = _id;
      };
      if(name) {
        obj.name = new RegExp(name, 'i');
      };
      if(phone) {
        obj.phone = new RegExp(phone, 'i');
      };
      if(addr) {
        obj.addr = new RegExp(addr, 'i');
      };
      if(detailAddr) {
        obj.detailAddr = new RegExp(detailAddr, 'i');
      };
      if(openid) {
        obj.openid = new RegExp(openid, 'i');
      };
      if(state) {
        obj.state = new RegExp(state, 'i');
      };
  Address.find(obj).sort({'created':-1}).skip((currentPage-1)*pageSize).limit(pageSize).exec(function (error, docs) {
    if(error){
      res.json({'success': false, 'data': error});
    }else{
      Address.countDocuments(obj,function(err,result){
        res.json({'success': '查询成功', 'data': docs, 'total': result});
      });
    }
  });
});

router.post('/address/createAndUpdate', passport.authenticate('bearer', { session: false }), (req, res) => {
  var id = req.body._id,
      dataObj = {
        name: req.body.name,
        phone: req.body.phone,
        addr: req.body.addr,
        detailAddr: req.body.detailAddr,
        tag: req.body.tag,
        openid: req.body.openid,
        state: req.body.state,
        delId: req.body.delId
    }
  if(id) {
    Address.update({_id: id}, {$set: dataObj},function(error, docs){
      if(error){
        res.json({'success': false, 'data': error});
      }else{
        res.json({'success': '修改成功', 'data': docs});
      }
    });
  } else {
    Address.create(dataObj, function (error, docs) {
      if(error){
        res.json({'success': false, 'data': error});
      }else{
        res.json({'success': '新增成功', 'data': docs});
      }
    });
  }
});

router.post('/address/delete', passport.authenticate('bearer', { session: false }), (req, res) => {
  var id = req.body._id;
  if(id) {
    Address.remove({_id: id}, function(error){
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
