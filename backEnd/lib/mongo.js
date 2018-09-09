var mongoose = require('mongoose');
var config = require('../config/default');
var db = mongoose.connect(config.mongodb, { useNewUrlParser: true });
module.exports = db;