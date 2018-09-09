const app = getApp();
const util = require("../../utils/util.js");
Page({
  data: {
    textarea: "",
    shopcart: {},
    address: {},
    sendTimeArr: [],
    sendTimeIndex: 0
  },
  onLoad: function () {
    var self = this;
    var shopcart = JSON.parse(wx.getStorageSync("shopcart"));
    console.log("shopcart");
    console.log(shopcart);
    this.setData({
      shopcart: shopcart
    });
    self.addressFindOne();
    console.log("sendTimeArr");
    console.log(util.sendTimeArr());
    var sendTimeArr = util.sendTimeArr();
    this.setData({
      sendTimeArr: sendTimeArr
    });
  },
  addressFindOne:function() {
    var self = this;
    app.request('weixin/address/findOne', {
      method: 'POST',
      data: { weiToken: wx.getStorageSync('weiToken') },
      success: function (res) {
        var datas = res.data.data;
        console.log("in use address---");
        console.log(datas);
        self.setData({
          address: datas
        });
      }
    }, self.addressFindOne);
  },
  bindinput: function (e) {
    this.setData({
      textarea: e.detail.value
    })
  },
  pay: function() {
    if (!util.isAfterTime()) {
      var self = this,
        goods = [],
        shopcartList = self.data.shopcart.shopcartList;

      for (var i = 0; i < shopcartList.length; i++) {
        var obj = {};
        obj.goodsId = shopcartList[i]["_id"];
        obj.num = shopcartList[i]["num"];
        goods.push(obj);
      }
      var formData = {
        addrId: self.data.address._id,
        sendTime: self.data.sendTimeArr[self.data.sendTimeIndex],
        goods: goods,
        explain: self.data.textarea
      }
      console.log("balance formData");
      console.log(formData);
      self.payCreate(formData);
    } else {
      wx.showToast({
        icon: 'none',
        title: util.showBusinessTime(),
        duration: 3000
      })
    }
  },
  payCreate: function (obj) {
    var self = this;
    obj.weiToken = wx.getStorageSync('weiToken');
    app.request('weixin/order/create', {
      method: 'POST',
      data: obj,
      success: function (res) {
        var datas = res.data.data;
        console.log(datas);
        wx.navigateTo({
          url: '../index/index'
        })
        wx.removeStorageSync("shopcart")
      }
    }, function () { self.payCreate(obj) });
  },
  toAddr: function() {
    wx.setStorageSync("page", "balance");
    wx.navigateTo({
      url: '../addressList/addressList'
    })
  },
  bindPickerChange: function (e) {
    this.setData({
      sendTimeIndex: e.detail.value
    })
  }
})