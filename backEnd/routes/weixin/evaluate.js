const express = require('express');
const Evaluate = require('../../models/evaluate');
const Order = require('../../models/order');
const redis = require('../../lib/redis.js');
const router = express.Router();

router.post('/evaluate/find', (req, res) => {
  	var obj = {delId: 0},
     	pageSize =  req.body.pageSize || 10,
      	currentPage =  req.body.currentPage || 1;
  	Evaluate.find(obj, {openid: 0}).sort({'created':-1}).skip((currentPage-1)*pageSize).limit(pageSize).exec(function (error, docs) {
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
      weiToken =  req.body.weiToken,
      dataObj = {
        avatarUrl: req.body.avatarUrl,
        sendStar: req.body.sendStar,
        tasteStar: req.body.tasteStar,
        packStar: req.body.packStar,
        explain: req.body.explain,
        imgs: req.body.imgs
      };
  redis.get(weiToken, function(err, data) {
      console.log('weixin address weiToken data===');
      console.log(data);
      if(err) {
        res.json({'success': false, 'data': err});
      } else {
        if(data) {
          dataObj.openid = data;
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
        } else {
          res.json({'success': false, 'data': 'E_VALIDATION_SESSION'});
        }
      }
    })

});

module.exports = router;
