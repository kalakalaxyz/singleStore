var redis = require('../lib/redis.js');
const config = require('../config/default.js');

module.exports = (app) => {
	app.use('/api',(req, res, next) => {
		var token = req.headers['authorization'] || req.body.token;
		if(token) {
			redis.get(token,function(err, data) {
				if(err) {
					res.json(err);
				}
				if(data) {
					redis.set(token,true);
					redis.expire(token, config.redis.time);
				}
			});
		}
		next();
	});
	app.use('/api', require('./address'));
	app.use('/api', require('./count'));
	app.use('/api', require('./evaluate'));
	app.use('/api', require('./goods'));
	app.use('/api', require('./imgUpload'));

	app.use('/api', require('./order'));
	app.use('/api', require('./seller'));
	app.use('/api', require('./users'));
	app.use('/api', require('./weiUsers'));
	
	app.use('/weixin', require('./weixin/address'));
	app.use('/weixin', require('./weixin/evaluate'));
	app.use('/weixin', require('./weixin/goods'));
	app.use('/weixin', require('./weixin/imgUpload'));
	app.use('/weixin', require('./weixin/order'));
	app.use('/weixin', require('./weixin/pay'));
	app.use('/weixin', require('./weixin/seller'));
	app.use('/weixin', require('./weixin/user'));
};