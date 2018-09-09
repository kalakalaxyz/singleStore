var express = require('express');
var path = require('path');
var cors = require('cors');
var bodyParser = require('body-parser');
var config = require('./config/default');
var routes = require('./routes/index');
var passport = require('passport');
var fs = require('fs');
var http = require('http');
var https = require('https');
var privateKey = fs.readFileSync(path.resolve(__dirname,'./')+'/ssl/privkey.pem', 'utf8');
var certificate = fs.readFileSync(path.resolve(__dirname,'./')+'/ssl/fullchain.pem', 'utf8');
var credentials = {key: privateKey, cert: certificate};
require('./lib/mongo.js');
//定时任务
var schedule = require('./schedule.js');
schedule();
var app = express();
app.use(cors());

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
//token验证
app.use(passport.initialize());
routes(app);
app.use('/public', express.static(__dirname+'/public'));
app.use('/', express.static(__dirname+'/views'));

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);
httpServer.listen(config.port, function() {
	var host = httpServer.address().address;
	var port = httpServer.address().port;
	console.log('Example app listening at http://'+host+':'+ port);
});
httpsServer.listen(config.sslPort, function() {
	var host = httpsServer.address().address;
	var port = httpsServer.address().port;
	console.log('Example app listening at http://'+host+':'+ port);
});

var io = require('socket.io')(httpServer);
var ioHttps = require('socket.io')(httpsServer);

io.on('connection', function (socket) {
  	socket.on('sellerRest', function (data) {
  		console.log("sellerRest========");
    	console.log(data);
    	socket.broadcast.emit('sellerRest', data);
  	});
    socket.on('goodsSellout', function (data) {
      console.log("goodsSellout========");
      console.log(data);
      socket.broadcast.emit('goodsSellout', data);
    });
    socket.on('businessTime', function (data) {
      console.log("businessTime========");
      console.log(data);
      socket.broadcast.emit('businessTime', data);
    });
});


ioHttps.on('connection', function (socket) {
  socket.on('sellerRest', function (data) {
      console.log("sellerRest========");
      console.log(data);
      socket.broadcast.emit('sellerRest', data);
    });
    socket.on('goodsSellout', function (data) {
      console.log("goodsSellout========");
      console.log(data);
      socket.broadcast.emit('goodsSellout', data);
    });
    socket.on('businessTime', function (data) {
      console.log("businessTime========");
      console.log(data);
      socket.broadcast.emit('businessTime', data);
    });
});
