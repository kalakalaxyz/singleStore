const app = getApp();
const util = require("../../utils/util.js");
Page({
  data: {
    orderList: [],
    orderPageSize: 10,
    orderCurrentPage: 1,
    scrollHeight: 300,
    orderTotal: 0,
    orderSwitch: true
  },
  onLoad: function () {
    var self = this;
    this.orderFind(self.data.orderPageSize, self.data.orderCurrentPage);
    wx.getSystemInfo({
      success: function (res) {
        console.info(res.windowHeight);
        let height = res.windowHeight;
        self.setData({
          scrollHeight: height
        });
      }
    });
  },
  orderFind: function (orderPageSize, orderCurrentPage) {
    var self = this;
    app.request('weixin/order/find', {
      method: 'POST',
      data: { pageSize: orderPageSize, currentPage: orderCurrentPage, weiToken: wx.getStorageSync('weiToken') },
      success: function (res) {
        var datas = res.data.data;
        console.log(datas);
        if (orderCurrentPage == 1) {
          self.data.orderList = [];
        }
        for (var i = 0; i < datas.length; i++) {
          self.data.orderList.push(datas[i]);
        }
        self.setData({
          orderList: self.data.orderList
        });
        self.setData({
          orderTotal: res.data.total
        });
        self.setData({
          orderCurrentPage: orderCurrentPage
        });
        self.setData({
          orderSwitch: true
        });
      }
    }, function () { self.orderFind(orderPageSize, orderCurrentPage)});
  },
  toEvaluate: function(e) {
    wx.setStorageSync("order", JSON.stringify(e.currentTarget.dataset.item));
    wx.navigateTo({
      url: '../evaluate/evaluate'
    })
  },
  toOrder: function (e) {
    console.log("orderList item---");
    console.log(e.currentTarget.dataset.item);
    wx.setStorageSync("order", JSON.stringify(e.currentTarget.dataset.item));
    wx.navigateTo({
      url: '../order/order'
    })
  },
  toOrderAgain: function (e) {
    if (app.globalData.sellerRest == 0) {
      if (!util.isAfterTime()) {
        console.log("toOrderAgain item---");
        console.log(e.currentTarget.dataset.item);
        var item = e.currentTarget.dataset.item;
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
          wx.setStorageSync("order", JSON.stringify(item));
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
  },
  orderListRefresh: function() {
    var self = this;
    this.orderFind(self.data.orderPageSize, 1);
  },
  orderListLoadMore: function () {
    var self = this;
    console.log("self.data.orderList.length------self.data.orderTotal");
    console.log(self.data.orderList.length + "------" + self.data.orderTotal);
    if (self.data.orderList.length < self.data.orderTotal) {
      if (self.data.orderSwitch) {
        self.setData({
          orderSwitch: false
        });
        var orderCurrentPage = self.data.orderCurrentPage + 1;
        this.orderFind(self.data.orderPageSize, orderCurrentPage);
      }
    } else {
      wx.showToast({
        title: '没有更多数据',
        duration: 3000
      })
    }
  }
})