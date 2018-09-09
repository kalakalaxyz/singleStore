const express = require('express');
const WeiUser = require('../models/weiUser');
const jwt = require('jsonwebtoken');
const config = require('../config/default.js');
const passport = require('passport');
const router = express.Router();

require('../passport')(passport);
const redis = require('../lib/redis.js');

router.post('/weiUser/find', passport.authenticate('bearer', { session: false }), (req, res) => {
  var obj = {},
      pageSize =  req.body.pageSize || 10,
      currentPage =  req.body.currentPage || 1;
  WeiUser.find(obj).sort({'created':-1}).skip((currentPage-1)*pageSize).limit(pageSize).exec(function (error, docs) {
    if(error){
      res.json({'success': false, 'data': error});
    }else{
      WeiUser.countDocuments(obj,function(err,result){
        res.json({'success': '查询成功', 'data': docs, 'total': result});
      });
    }
  });
});


router.post('/weiUser/delete', passport.authenticate('bearer', { session: false }), (req, res) => {
  var id = req.body._id;
  if(id) {
    WeiUser.remove({_id: id}, function(error){
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
