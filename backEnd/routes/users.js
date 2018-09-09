const express = require('express');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const config = require('../config/default.js');
const passport = require('passport');
const router = express.Router();

require('../passport')(passport);
const redis = require('../lib/redis.js');
// 注册账户
// router.post('/signup', (req, res) => {
router.post('/signup', passport.authenticate('bearer', { session: false }), (req, res) => {
  var name = req.body.name,
      password = req.body.password;
  if (!name || !password) {
    res.json({success: false, data: '请输入您的账号密码.'});
  } else {
    User.findOne({
      name: name
    }, (err, user) => {
      if (err) {
        throw err;
      }
      if (user) {
        res.json({success: false, data:'用户已存在!'});
      } else if(!user) {
        var newUser = new User({
          name: name,
          password: password
        });
        newUser.save((err) => {
          if (err) {
            return res.json({success: false, data: '注册失败!'});
          }
          res.json({success: true, data: '成功创建新用户!'});
        });
      }
    })
  }
});
//登录  检查用户名与密码并生成一个accesstoken如果验证通过
router.post('/user/login', (req, res) => {
  var name = req.body.name,
      password = req.body.password;
  User.findOne({
    name: name
  }, (err, user) => {
    if (err) {
      throw err;
    }
    if (!user) {
      res.json({success: false, data:'认证失败,用户不存在!'});
    } else if(user) {
      if(password == user.password) {
        var token = jwt.sign({name: user.name}, config.secret);
        redis.set('Bearer ' + token,true,function(err, data) {
          if (err) {
            res.json(err);
          } else {
            res.json({
              success: true,
              data: '验证成功!',
              token: 'Bearer ' + token,
              name: user.name
            });
          }
        });
        redis.expire('Bearer ' + token, config.redis.time);
      } else {
        res.json({success: false, data: '认证失败,密码错误!'});
      }
    }
  });
});

router.post('/user/signout', (req, res) => {
  var token = req.body.token;
  redis.set(token, false, function(err, data) {
    if (err) {
      res.json(err);
    } else {
      res.json({
        success: true,
        data: '退出成功!'
      });
    }
  });
});

router.post('/user/find', passport.authenticate('bearer', { session: false }), (req, res) => {
  var obj = {},
      pageSize =  req.body.pageSize || 10,
      currentPage =  req.body.currentPage || 1;
  User.find(obj).skip((currentPage-1)*pageSize).limit(pageSize).exec(function (error, docs) {
    if(error){
      res.json({'success': false, 'data': error});
    }else{
      User.countDocuments(obj,function(err,result){
        res.json({'success': '查询成功', 'data': docs, 'total': result});
      });
    }
  });
});

router.post('/user/createAndUpdate', passport.authenticate('bearer', { session: false }), (req, res) => {
  var id = req.body._id,
      name = req.body.name,
      password = req.body.password,
      token = req.body.token
  if(id) {
    User.update({_id: id}, {$set: {
      name: name,
      password: password,
      token: token
    }},function(error, docs){
      if(error){
        res.json({'success': false, 'data': error});
      }else{
        res.json({'success': '修改成功', 'data': docs});
      }
    });
  }
});

router.post('/user/delete', passport.authenticate('bearer', { session: false }), (req, res) => {
  var id = req.body._id;
  if(id) {
    User.remove({_id: id}, function(error){
      if(error){
        res.json({'success': false, 'data': error});
      }else{
        res.json({'success': '删除成功'});
      }
    })
  } else {
    res.json({'success': false, 'data': '无id'});
  }
});

module.exports = router;
