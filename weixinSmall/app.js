//app.js
App({
  globalData: {
    // host: "https://www.domain.com:443/",
    host: "http://127.0.0.1:80/",
    userInfo: {},
    tags: ["家", "公司", "学校"],
    timeFrom: "08:00",
    timeTo: "21:00",
    sellerRest: 0, //商家休息，0未休息，1休息
    selloutId: []
  },
  onLaunch: function () {
  },
  login: function (cb) {
    var self = this;
    wx.login({
      success: function (resLogin) {
        console.log('resLogin.code');
        console.log(resLogin.code);
        self.request('weixin/user/login', {
          method: "POST",
          data: { code: resLogin.code },
          success: function (resToken) {
            console.log('resToken');
            console.log(resToken);
            var token = resToken.data.token;
            console.log('token');
            console.log(token);
            wx.setStorageSync('weiToken', token);
            typeof cb == "function" && cb()
          }
        })
      }
    });
  },
  request: function (url, options, cb) {
    var self = this,
      mySuc,
      myFail,
      defaults = {
        data: "",
        headers: { 'content-type': 'application/json'},
        method: "GET",
        dataType: "json",
        success: function (res) {
          if (!res.data.success && res.data.data == 'E_VALIDATION_SESSION') {
            self.login(function() {
              typeof cb == 'function' && cb();
            });
          } else {
            typeof mySuc == 'function' && mySuc(res);
          }
        },
        fail: function (res) {
          if (myFail) {
            typeof mySuc == 'function' && myFail(res)
          } else {
            setTimeout(function () {
              wx.showToast({
                title: '服务器异常',
                duration: 3000
              })
            }, 100);
          }
        },
        complete: function (res) {
          console.log(res);
          wx.hideLoading();
          if (res.errMsg == "request:fail") {
          } else {
            if (res.data.success) {
              if (defaults.method != 'GET') {
                wx.showToast({
                  title: '操作成功',
                  duration: 1000
                })
              }
            } else {
              wx.showToast({
                title: res.data.data,
                duration: 3000
              })
            }
          }
        }
      }
    if (typeof options == "function") {
      mySuc = options
    } else {
      for (var key in options) {
        if (key == 'success') {
          mySuc = options['success'];
        } else if (key == 'fail') {
          myFail = options['fail'];
        } else {
          defaults[key] = options[key];
        }
      }
    }
    defaults.url = self.globalData.host + url;
    var weiToken = wx.getStorageSync('weiToken');
    defaults.headers.Authorization = weiToken;
    console.log('weiToken');
    console.log(weiToken);
    wx.showLoading({
      title: '加载中'
    });
    wx.request(defaults);
  },
  isEmptyObject: function(obj) {
    for (var key in obj) {
      return false;
    }
    return true;
  }
})