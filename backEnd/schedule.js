var schedule = require('node-schedule');
var Order = require('./models/order.js');
var Goods = require('./models/goods.js');
var Seller = require('./models/seller.js');
//定时任务
module.exports = function() {
	schedule.scheduleJob('00 00 21 * * *', function(){
        console.log('scheduleCronstyle:' + new Date());
        //商品月售数量计算
        var days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
        	nowDate = new Date(),
	        year = nowDate.getFullYear(),
	        month = nowDate.getMonth()+1,
	        date = nowDate.getDate(),

	        lastMonth = month - 1,
	        lastMonthDate = date;

        if(year % 4 == 0) {
        	days["1"] = 29
        }
        if(month == 1) {
        	year -= 1;
        	lastMonth = 12;
        }
        if(date > days[lastMonth - 1]) {
        	lastMonth +=1;
        	lastMonthDate = 1;
        }
        var timeStr = year + "-" + lastMonth + "-" + lastMonthDate+ " 0:0:0";
        var totalNum = 0;
        Order.find({"created":{"$gt":timeStr}}).exec(function (error, docs) {
		    if(error){
		      	console.log({'success': false, 'data': error});
		    }else{
		    	console.log("schedule order docs====");
		      	console.log(docs);
		      	var goodsIdNum = {};
		      	docs.forEach(function(item, index, docsArr) {
		      		var goods = item.goods;
		      		goods.forEach(function(goodsItem, goodsIndex, goodsArr) {
		      			console.log("schedule order docs goodsItem====");
		      			console.log(goodsItem);
		      			var goodsNumKeyArr = Object.keys(goodsIdNum);
		      			if(goodsNumKeyArr.indexOf(goodsItem.goodsId) >= 0) {
		      				goodsIdNum[goodsItem.goodsId] += goodsItem.num;
		      			} else {
		      				goodsIdNum[goodsItem.goodsId] = goodsItem.num;
		      			}
		      		})
		      	})
		      	console.log("schedule order goodsIdNum");
		      	console.log(goodsIdNum);
		      	Goods.find({}).exec(function (error, goodsDocs) {
				    if(error){
				      	console.log({'success': false, 'data': error});
				    }else{
				      	goodsDocs.forEach(function(good, index, Arr) {
				      		for(var key in goodsIdNum) {
				      			if(good._id == key) {
				      				good.sendNum = goodsIdNum[key];
				      				totalNum += goodsIdNum[key];
				      				good.save();
				      			}
				      		}
				      	})
				      	console.log({'success': true, 'data': "商品月售修改成功"});
				    }
				});
		    }
		});
		setTimeout(function() {
			var obj = {};
			Seller.find(obj).exec(function (error, docs) {
			    if(error){
			      	console.log({'success': false, 'data': error});
			    }else{
			    	docs.forEach(function(item, index, arrSeller) {
			    		console.log("Seller item====");
			    		console.log(item);
			    		console.log("totalNum==" + totalNum);
			    		item.saleNum = totalNum;
			    		item.save();
			    	})
			      	console.log({'success': true, 'data': "商家月售总数修改成功"});
			    }
			});
		}, 1000);
    });
}