const express = require('express');
const router = express.Router();
const passport = require('passport');
require('../passport')(passport);
var formidable = require('formidable');
var path=require('path');
var fs=require('fs');


router.post('/image/upload', passport.authenticate('bearer', { session: false }), (req, res) => {
  var uploadDir=path.resolve(__dirname,'../public/images/');
  var form = new formidable.IncomingForm();
  form.encoding='utf-8';
  form.uploadDir=uploadDir;
  form.extensions=true;
  form.maxFieldsSize = 1 * 1024 * 1024;
  form.parse(req, function(err, fields, files) {
    var file = files.photo;
    console.log(file);
    var oldpath =path.normalize(file.path);//返回正确格式的路径
    console.log("oldpath1--");
    console.log(oldpath);
    oldpath = oldpath.replace(/\\/g, "/");
    var dir = path.resolve(__dirname,'../');
    console.log("dir1--");
    console.log(dir);
    dir = dir.replace(/\\/g, "/");
    console.log('oldpath--'+oldpath);
    console.log('dir--'+dir);
    oldpath = oldpath.replace(dir, '.');
    res.json({success: true, data: oldpath});
  });
});

module.exports = router;
