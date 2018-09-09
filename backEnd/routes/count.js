const express = require('express');
const Order = require('../models/order');
const Address = require('../models/address');
const router = express.Router();
const passport = require('passport');
require('../passport')(passport);
const print = require('./weixin/print.js');
const format = require('../format.js');

router.post('/count/find', passport.authenticate('bearer', { session: false }), (req, res) => {
  var obj = {},
      createdFrom =  req.body.createdFrom || "2018-07-01 00:00:00",
      createdTo =  req.body.createdTo || "2118-07-01 00:00:00",
      sendTimeFrom =  req.body.sendTimeFrom || "00:00:00",
      sendTimeTo =  req.body.sendTimeTo || "23:59:59",
      pageSize =  req.body.pageSize || 10,
      currentPage =  req.body.currentPage || 1;
      obj["$and"] = [{"created": {"$gt": createdFrom}}, {"created": {"$lt": createdTo}},{"sendTime": {"$gt": sendTimeFrom}}, {"sendTime": {"$lt": sendTimeTo}}];
      var objAddr = {},
          addr = req.body.addr,
          detailAddr = req.body.detailAddr;
      if(addr) {
        objAddr.addr =  new RegExp(addr, 'i');
      };
      if(detailAddr) {
        objAddr.detailAddr = new RegExp(detailAddr, 'i');
      };
      Address.find(objAddr).exec(function(err, addrs) {
        var ids = [];
        addrs.forEach(function(item, index, addrs) {
          ids.push(item._id);
        })
        console.log("addrs===");
        console.log(ids);
        obj.addrId = {$in: ids};
        obj.delId = 0;
        Order.find(obj).sort({'created':-1}).skip((currentPage-1)*pageSize).limit(pageSize).exec(function (error, docs) {
          if(error){
            res.json({'success': false, 'data': error});
          }else{
            var goodsIdPriceNum = {};
            /**
            * goodsIdPriceNum = {
            *    商品id: {价: 对应量,12: 100,14 : 100} //价格不一样是因为之前改过价格;
            * }
            **/
            docs.forEach(function(item, index, docsArr) {
              var goods = item.goods;
              goods.forEach(function(goodsItem, goodsIndex, goodsArr) {
                console.log("count order docs goodsItem====");
                console.log(goodsItem);
                var goodsIdArr = Object.keys(goodsIdPriceNum);
                if(goodsIdArr.indexOf(goodsItem.goodsId) >= 0) {
                  goodsIdPriceNum[goodsItem.goodsId][goodsItem.price] += goodsItem.num;
                } else {
                  goodsIdPriceNum[goodsItem.goodsId] = {};
                  goodsIdPriceNum[goodsItem.goodsId][goodsItem.price] = goodsItem.num;
                }
              })
            });

            var arr = [];
            /**
            * arr = [
            *    { goodsId: "ididididid",
            *      priceNum: [{price: 14, num: 100}, {price: 14, num: 100}],
            *      totalMoney: 2800
            *    }
            * ]
            **/
            var totalNum = 0;
            var totalMoney = 0;
            for (var id in goodsIdPriceNum) {
              var priceNumObj = goodsIdPriceNum[id];
              var obj1 = {};
              obj1.goodsId = id;
              obj1.priceNum = [];
              obj1.totalMoney = 0;
              for (var price in priceNumObj) {
                var obj2 = {};
                obj2.price = price;
                obj2.num = priceNumObj[price];
                obj1.priceNum.push(obj2);
                obj1.totalMoney += parseInt(price) * parseInt(priceNumObj[price]);
                totalNum += parseInt(priceNumObj[price]);
                totalMoney += parseInt(price) * parseInt(priceNumObj[price]);
              }
              arr.push(obj1);
            }

            Order.countDocuments(obj,function(err,result){
              res.json({
                'success': '查询成功', 
                'data': docs, 
                'goodsArr': arr,
                'totalNum': totalNum,
                'totalMoney': totalMoney, 
                'total': result
              });
            });
          }
        });
      })
});

module.exports = router;
