var qr_image = require('qr-image');
//将text转成base64的png图片
module.exports = function(text) {
	var pngBuffer = qr_image.imageSync(text);
  	// return "data:image/png;base64," + pngBuffer.toString('base64');
  	return pngBuffer.toString('base64');
}