const app = getApp();
const util = require('../../utils/util.js')
Page({
  data: {
    order: {}
  },
  onLoad: function () {
    var self = this;
    var order = JSON.parse(wx.getStorageSync("order"));
    console.log("order");
    console.log(order);
    for(var key in order) {
      if(key == 'arriveTime' || key == 'created') {
        order[key] = util.formatTime(new Date(order[key]));
      }
    }
    this.setData({
      order: order
    });
  },
  toEvaluate: function () {
    wx.navigateTo({
      url: '../evaluate/evaluate'
    })
  },
  toOrderAgain: function (e) {
    var self = this;
    if (app.globalData.sellerRest == 0) {
      if (!util.isAfterTime()) {
        var item = self.data.order;
        var goods = item.goods;
        var selloutId = app.globalData.selloutId;
        var goodsName = "";
        for (var i = 0; i < goods.length; i++) {
          for (var j = 0; j < selloutId.length; j++) {
            if (goods[i].goodsId._id == selloutId[j]) {
              goodsName += goods[i].goodsId.name + "、";
            }
          }
        }
        console.log("sellout goodsName==: " + goodsName);
        if (goodsName) {
          goodsName = goodsName.slice(0, goodsName.length - 1);
          wx.showToast({
            title: goodsName + "已售完，请从主页重新点餐，谢谢！！！",
            icon: "none",
            duration: 3000
          })
        } else {
          wx.navigateTo({
            url: '../orderAgain/orderAgain'
          })
        }
      } else {
        wx.showToast({
          icon: 'none',
          title: util.showBusinessTime(),
          duration: 3000
        });
      }
    } else {
      wx.showToast({
        title: '商家休息',
        duration: 1000
      })
    }
  }
})