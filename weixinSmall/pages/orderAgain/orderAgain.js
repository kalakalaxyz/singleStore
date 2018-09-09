const app = getApp();
const util = require("../../utils/util.js");
Page({
  data: {
    textarea: "",
    order: {},
    sendTimeArr: [],
    sendTimeIndex: 0
  },
  onLoad: function () {
    var self = this;
    var order = JSON.parse(wx.getStorageSync("order"));
    var totalMoney = 0;
    for(var i = 0; i < order.goods.length; i++) {
      totalMoney += order.goods[i].goodsId.price * order.goods[i].num
    }
    order.totalMoney = totalMoney;
    console.log("orderAgain order");
    console.log(order);
    this.setData({
      order: order
    });
    console.log("sendTimeArr");
    console.log(util.sendTimeArr());
    var sendTimeArr = util.sendTimeArr();
    this.setData({
      sendTimeArr: sendTimeArr
    });
  },
  bindinput: function (e) {
    this.setData({
      textarea: e.detail.value
    })
  },
  pay: function () {
    if (!util.isAfterTime()) {
      var self = this,
        goods = [],
        shopcartList = self.data.order.goods;

      for (var i = 0; i < shopcartList.length; i++) {
        var obj = {};
        obj.goodsId = shopcartList[i]["goodsId"]["_id"];
        obj.num = shopcartList[i]["num"];
        goods.push(obj);
      }
      var formData = {
        addrId: self.data.order.addrId._id,
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
      });
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
      }
    }, function () { self.payCreate(obj) });
  },
  bindPickerChange: function (e) {
    this.setData({
      sendTimeIndex: e.detail.value
    })
  }
})