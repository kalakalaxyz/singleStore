const express = require('express');
const Order = require('../../models/order');
const Goods = require('../../models/goods');
const redis = require('../../lib/redis.js');
const print = require('./print.js');
const router = express.Router();

router.post('/order/find', (req, res) => {
  	var obj = {delId: 0},
      	weiToken =  req.body.weiToken,
      	pageSize =  req.body.pageSize || 10,
      	currentPage =  req.body.currentPage || 1;
    redis.get(weiToken, function(err, data) {
    	console.log('weixin order weiToken data===');
    	console.log(data);
    	if(err) {
    		res.json({'success': false, 'data': err});
    	} else {
        if(data) {
          obj.openid = data;
          Order.find(obj, {openid: 0}).sort({'created':-1}).populate({path: "addrId goods.goodsId", select:{openid: 0}}).skip((currentPage-1)*pageSize).limit(pageSize).exec(function (error, docs) {
            if(error){
                res.json({'success': false, 'data': error});
            }else{
                Order.countDocuments(obj,function(err,result){
                  res.json({'success': '查询成功', 'data': docs, 'total': result});
                });
            }
          });
        } else {
          res.json({'success': false, 'data': 'E_VALIDATION_SESSION'});
        }
    	}
    })
});

router.post('/order/create', (req, res) => {
    var weiToken =  req.body.weiToken,
        dataObj = {
          addrId: req.body.addrId,
          sendTime: req.body.sendTime,
          payType: "微信在线支付",
          goods: req.body.goods,
          explain: req.body.explain,
          state: "已送出",
          evaluate: 0,
          print: 0,
          printNum: 0
        };
    redis.get(weiToken, function(err, data) {
       console.log('weixin address weiToken data===');
       console.log(data);
        if(err) {
          res.json({'success': false, 'data': err});
        } else {
          if(data) {
              dataObj.openid = data;
              Order.create(dataObj, function (error, docs) {
                  if(error){
                    res.json({'success': false, 'data': error});
                  }else{
                    print(req, res, docs);
                    // res.json({'success': '新增成功', 'data': docs});
                    console.log("docs.goods");
                    console.log(docs.goods);
                    var totalMoney = 0;
                    goodsIdPrice = {};
                    docs.goods.forEach(function(item, index, goods) {
                      console.log(item);
                      Goods.findOne({_id: item.goodsId}).exec(function (error, docsGoods) {
                        if(error){
                          // res.json({'success': false, 'data': error});
                        }else{
                          console.log(docsGoods);
                          docsGoods.totalNum += item.num;
                          docsGoods.save();
                          goodsIdPrice[docsGoods._id] = docsGoods.price;
                          totalMoney += item.num * docsGoods.price;
                        }
                      })
                    })
                    setTimeout(function() {
                      console.log("goodsIdPrice==");
                      console.log(goodsIdPrice);
                      console.log("totalMoney==");
                      console.log(totalMoney);
                      Order.findOne({_id: docs._id}).exec(function (error, docsOrder) {
                        if(error){
                          console.log({'success': false, 'data': error});
                        }else{
                          docsOrder.totalMoney = totalMoney;
                          for (var i = 0; i < docsOrder.goods.length; i++) {
                            docsOrder.goods[i].price = goodsIdPrice[docsOrder.goods[i].goodsId];
                          }
                          docsOrder.save();
                          console.log({'success': true, 'data': docsOrder});
                        }
                      })
                    }, 50)
                    
                  }
              });
          
          } else {
              res.json({'success': false, 'data': 'E_VALIDATION_SESSION'});
          }
        }
    })

});

router.post('/order/evaluate', (req, res) => {
    var weiToken =  req.body.weiToken,
        orderId = req.body.orderId;
    redis.get(weiToken, function(err, data) {
       console.log('weixin address weiToken data===');
       console.log(data);
        if(err) {
          res.json({'success': false, 'data': err});
        } else {
          if(data) {
            Order.update({_id: orderId}, {$set: {evaluate: 1}},function(error, docs){
              if(error){
                res.json({'success': false, 'data': error});
              }else{
                res.json({'success': '修改成功', 'data': docs});
              }
            });
          } else {
              res.json({'success': false, 'data': 'E_VALIDATION_SESSION'});
          }
        }
    })

});


module.exports = router;
