//引入编码模块
var iconv = require("iconv-lite");
//引入 printhelper 模块
var printhelper = require("../../duiPrint/printhelper.js");
var qr_image = require('../../qrImage');
const Order = require('../../models/order');
const config = require('../../config/default.js');
const format = require('../../format.js');
//设备编号
var uuid = "eb427e672d04e73c";//您的设备编号


//用户绑定
var data ={
  Uuid:uuid,
  UserId:"190559760" //0改成您系统的用户编号（自己定义）最好是数字
}

// 打印内容
module.exports = function(req, res, obj) {
	var _id = obj._id;
	if(_id) {
		Order.findOne({_id: _id}).populate("addrId goods.goodsId").exec(function (error, docs) {
            if(error){
            	res.json({'success': false, 'data': error});
            }else{
            	console.log("docs");
            	console.log(docs);
            	console.log("docs.goods");
            	console.log(docs.goods);
            	printhelper.userBind(data, function(res1) {
					//返回格式 {"OpenUserId":160715,"Code":200,"Message":"成功"}
					res1 = JSON.parse(res1);
					if(res1.Code == 200) {
						printhelper.getDeviceState(data,function(res2) {
							//返回格式 {"State":0,"Code":200,"Message":"成功"} state:代表设备状态
							res2 = JSON.parse(res2);
							if(res2.State == 0) {
								var OpenUserId = res1.OpenUserId;
								var printObj = {
									orderId1: docs._id + "起",
									sellerName: "美滋滋",
									created: "下单时间: " + format(new Date(docs.created), "yyyy-MM-dd hh:mm:ss"),
									sendTime: "送达时间: " + docs.sendTime,
									addr: docs.addrId.addr,
									detailAddr: docs.addrId.detailAddr,
									name: "姓名: " + docs.addrId.name,
									phone: "电话:" + docs.addrId.phone,
									explain: "备注:" + docs.explain,
									orderId2: docs._id + "止"
								}
								var goods = [];
								var totalMoney = 0;
								for(var i = 0; i < docs.goods.length; i++) {
									var content = docs.goods[i]["goodsId"]["name"] + " X " + docs.goods[i]["num"];
									// var content = docs.goods[i]["goodsId"]["name"] + " X " + docs.goods[i]["num"] + " = " + docs.goods[i]["goodsId"]["price"]*docs.goods[i]["num"];
									totalMoney += docs.goods[i]["goodsId"]["price"]*docs.goods[i]["num"];
									var b = new Buffer(iconv.encode(content,'GBK'));
									content = b.toString("base64");
									goods.push(content);
								}
								printObj.totalMoney = "合计： " + totalMoney + "元";
								console.log("printObj===");
								console.log(printObj);
								for(var key in printObj) {
									printObj[key] = new Buffer(iconv.encode(printObj[key], 'GBK'));
									printObj[key] = printObj[key].toString("base64");
								}
								var base64 = qr_image(config.host + "api/order/arrive?id=" + docs._id);
								console.log("goods===");
								console.log(goods);
								console.log("base64===");
								console.log(base64);
								var jsonContent = "[{\"Alignment\":0,\"BaseText\":\"" + printObj.orderId1 + "\",\"Bold\":0,\"FontSize\":0,\"PrintType\":0},"+
								"{\"Alignment\":1,\"BaseText\":\"" + printObj.sellerName + "\",\"Bold\":0,\"FontSize\":1,\"PrintType\":0},"+
								"{\"Alignment\":0,\"BaseText\":\"" + printObj.created + "\",\"Bold\":0,\"FontSize\":0,\"PrintType\":0},"+
								"{\"Alignment\":0,\"BaseText\":\"" + printObj.sendTime + "\",\"Bold\":0,\"FontSize\":0,\"PrintType\":0},";
								for(var i = 0; i < goods.length; i++) {
									jsonContent += "{\"Alignment\":0,\"BaseText\":\"" + goods[i] + "\",\"Bold\":0,\"FontSize\":1,\"PrintType\":0},"
								}
								jsonContent += "{\"Alignment\":0,\"BaseText\":\"" + printObj.totalMoney + "\",\"Bold\":0,\"FontSize\":0,\"PrintType\":0},"+
								"{\"Alignment\":0,\"BaseText\":\"" + printObj.addr + "\",\"Bold\":0,\"FontSize\":0,\"PrintType\":0},"+
								"{\"Alignment\":0,\"BaseText\":\"" + printObj.detailAddr + "\",\"Bold\":0,\"FontSize\":1,\"PrintType\":0},"+
								"{\"Alignment\":0,\"BaseText\":\"" + printObj.name + "\",\"Bold\":0,\"FontSize\":0,\"PrintType\":0},"+
								"{\"Alignment\":0,\"BaseText\":\"" + printObj.phone + "\",\"Bold\":0,\"FontSize\":1,\"PrintType\":0},"+
								"{\"Alignment\":0,\"BaseText\":\"" + printObj.explain + "\",\"Bold\":0,\"FontSize\":1,\"PrintType\":0},"+
								"{\"Alignment\":1,\"BaseText\":\"" + base64 + "\",\"Bold\":0,\"FontSize\":0,\"PrintType\":1},"+
								"{\"Alignment\":0,\"BaseText\":\"" + printObj.orderId2 + "\",\"Bold\":0,\"FontSize\":0,\"PrintType\":0}]";
								var data2 = {
								  Uuid: uuid,
								  PrintContent: jsonContent,
								  OpenUserId: OpenUserId
								}
								printhelper.printContent(data2, function(res3) {
									//返回格式 {"TaskId":0,"Code":200,"Message":"成功"}  TaskId:任务编号
									res3 = JSON.parse(res3);
									if(res3.Code == 200) {
										var data3 = {
											TaskId: res3.TaskId
										}
										printhelper.getTaskState(data3, function(res4) {
											//返回格式 {"State":1,"Code":200,"Message":"成功"} state:代表打印任务状态，详见api文档
										  	res4 = JSON.parse(res4);
										  	console.log("res4============");
										  	console.log(res4);
										  	if(res4.Code == 200 && res4.State == 0) {
										  		console.log("进入到修改打印状态");
										  		docs.print =1;
										  		docs.printNum +=1;
										  		docs.save();
										  		res.json({success: true, data: res4.Message});
										  	} else {
										  		res.json({success: false, data: res4.Message, explain: "任务状态出错"});
										  	}
										});
									} else {
										res.json({success: false, data: res3.Message, explain: "打印出错"});
									}
								});
							} else {
								res.json({success: false, data: res2.Message, explain: "设备状态出错"});
							}
						});
					} else {
						res.json({success: false, data: res1.Message, explain: "用户设备绑定出错"});
					}
				});
        	}
        });
	}
};

