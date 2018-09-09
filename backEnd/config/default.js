module.exports = {
  port: 80,
  sslPort: 443,
  // session: {
  //   secret: 'test',
  //   key: 'test',
  //   maxAge:30*24*60*60*1000
  // },
  mongodb: 'mongodb://localhost:27017/test',
  secret: 'waimai2', //token密码
  redis: {
  	port: 6379,
  	host: '127.0.0.1',
  	secret: 'ecp',
    time: 60*5 //5分钟
  },
  // host: "https://www.domain.com:443/",
  host: "http://192.168.0.100:80/" //生成二维码时的host,扫码用的
};