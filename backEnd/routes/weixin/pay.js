const express = require('express');
const Order = require('../../models/order');
const redis = require('../../lib/redis.js');
const router = express.Router();

router.post('/pay/create', (req, res) => {
  	// var weiToken =  req.body.weiToken,
   //    	dataObj = {
	  //       addrId: req.body.addrId,
	  //       sendTime: req.body.sendTime,
	  //       payType: "微信在线支付",
	  //       goods: req.body.goods,
	  //       explain: req.body.explain,
	  //       state: "已送出",
	  //       evaluate: 0
   //    	};
  	// redis.get(weiToken, function(err, data) {
	  //    console.log('weixin address weiToken data===');
	  //    console.log(data);
   //    	if(err) {
   //      	res.json({'success': false, 'data': err});
   //    	} else {
   //      	if(data) {
   //        		dataObj.openid = data;
   //          	Order.create(dataObj, function (error, docs) {
   //            		if(error){
   //              		res.json({'success': false, 'data': error});
   //            		}else{
   //              		res.json({'success': '新增成功', 'data': docs});
   //            		}
   //          	});
          
   //      	} else {
   //        		res.json({'success': false, 'data': 'E_VALIDATION_SESSION'});
   //      	}
   //    	}
   //  })

});

module.exports = router;
