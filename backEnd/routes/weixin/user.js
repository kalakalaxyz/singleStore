const express = require('express');
const router = express.Router();
const config = require('../../config/default.js');
const redis = require('../../lib/redis.js');
var request = require('request');
const WeiUser = require('../../models/weiUser');
const passport = require('passport');
require('../../passport')(passport);

function createToken() {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const length = chars.length;
  let str = "";
  for (let i = 0; i < length; i++) {
    str += chars.substr(Math.round(Math.random() * length), 1);
  }
  return str;
};
//登录  通过code生成一个accesstoken
router.post('/user/login', (req, res) => {
  console.log(req.body);
  var code = req.body.code;
  request.get({
    url: 'https://api.weixin.qq.com/sns/jscode2session',
    json: true,
    qs: {
      grant_type: 'authorization_code',
      appid: 'wxd342972870c20540',
      secret: '8631cb207cd056137d395ebdfc9e979e',
      js_code: code
    }
  }, function (err, response, data) {
    if (response.statusCode === 200) {
      console.log("[openid]", data.openid);
      console.log("[session_key]", data.session_key);
      var token = createToken();
      redis.set(token, data.openid, function(err2, data2) {
        if (err2) {
          res.json({success: false, data: err2});
        } else {
          res.json({
            success: true,
            data: '验证成功!',
            token: token
          });
        }
      });
      redis.expire(token, config.redis.time);
      WeiUser.findOne({
        openid: data.openid
      }, (err, weiUser) => {
        if (err) {
          throw err;
        }
        if (weiUser) {
          console.log("weiUser");
          console.log(weiUser);
          WeiUser.update({openid: data.openid}, {$set: {
            openid: data.openid,
            session_key: data.session_key,
            token: token
          }},function(error, docs){
            if(error){
              res.json({'success': false, 'data': error});
            }
          });
        } else if(!weiUser) {
          console.log("!weiUser");
          console.log(weiUser);
          var newUser = new WeiUser({
            openid: data.openid,
            session_key: data.session_key,
            token: token
          });
          newUser.save((err) => {
            if (err) {
              return res.json({success: false, data: '注册失败!'});
            }
          });
        }
      })
    } else {
      res.json({success: false, data: err});
    }
  })
});


module.exports = router;
