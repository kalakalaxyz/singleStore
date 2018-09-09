var utils = require("./utils.js");

var printhelper = {
	userBind:function(data,callback){
		return utils.sendPost("/home/userbind",data,callback);		
	},
	getDeviceState:function(data,callback){
		return utils.sendPost("/home/getdevicestate",data,callback);
	},
	printContent:function(data,callback){
		return utils.sendPost("/home/printcontent2",data,callback);
	},
	printHtmlContent:function(data,callback){
		return utils.sendPost("/home/printhtmlcontent",data,callback);
	},
	getTaskState:function(data,callback){
		return utils.sendPost("/home/getprinttaskstate",data,callback);
	}
}
module.exports = printhelper;
