const express = require('express');
const Evaluate = require('../models/evaluate');
const router = express.Router();
const passport = require('passport');
require('../passport')(passport);

// 全部地址信息
router.post('/evaluate/find', (req, res) => {
  var obj = {},
      pageSize =  req.body.pageSize || 10,
      currentPage =  req.body.currentPage || 1;
  Evaluate.find(obj).sort({'created':-1}).skip((currentPage-1)*pageSize).limit(pageSize).exec(function (error, docs) {
    if(error){
      res.json({'success': false, 'data': error});
    }else{
      Evaluate.countDocuments(obj,function(err,result){
        res.json({'success': '查询成功', 'data': docs, 'total': result});
      });
    }
  });
});

router.post('/evaluate/createAndUpdate', (req, res) => {
  var id = req.body._id,
      dataObj = {
        avatarUrl: req.body.avatarUrl,
        sendStar: req.body.sendStar,
        tasteStar: req.body.tasteStar,
        packStar: req.body.packStar,
        explain: req.body.explain,
        openid: req.body.openid,
        imgs: req.body.imgs,
        delId: req.body.delId
      };
  if(id) {
    Evaluate.update({_id: id}, {$set: dataObj},function(error, docs){
      if(error){
        res.json({'success': false, 'data': error});
      }else{
        res.json({'success': '修改成功', 'data': docs});
      }
    });
  } else {
    Evaluate.create(dataObj, function (error, docs) {
      if(error){
        res.json({'success': false, 'data': error});
      }else{
        res.json({'success': '新增成功', 'data': docs});
      }
    });
  }

});

router.post('/evaluate/delete', passport.authenticate('bearer', { session: false }), (req, res) => {
  var id = req.body._id;
  if(id) {
    Evaluate.remove({_id: id}, function(error){
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
