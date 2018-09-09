//扩展日期格式化(yyyy-MM-dd hh:mm:ss)
module.exports = function(date, format) {
	var opt = {
			"M+" : date.getMonth()+1,
			"d+" : date.getDate(),
			"h+" : date.getHours(),
			"m+" : date.getMinutes(),
			"s+" : date.getSeconds()
		};

		if(new RegExp(/(y+)/).test(format)) {
			format = format.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));
		};

		for(var key in opt) {
			if(new RegExp("("+ key +")").test(format)) {
				format = format.replace(RegExp.$1, RegExp.$1.length==1 ? opt[key] : ("00"+ opt[key]).substr((""+ opt[key]).length));
			}
		};
		return format;
}