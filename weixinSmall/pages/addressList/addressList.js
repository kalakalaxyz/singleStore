const app = getApp();
Page({
  data: {
    tags: [],
    addressList: [],
    addressPageSize: 10,
    addressCurrentPage: 1,
    page: "",
    scrollHeight: 300
  },
  onLoad: function () {
    var self = this;
    var page = wx.getStorageSync("page");
    if(page) {
      this.setData({
        page: page
      })
    }
    this.addressFind();
    this.setData({
      tags: app.globalData.tags
    })
    wx.getSystemInfo({
      success: function (res) {
        console.info(res.windowHeight);
        let height = res.windowHeight;
        wx.createSelectorQuery().selectAll('.scroll-height').boundingClientRect(function (rects) {
          rects.forEach(function (rect) {
            console.log(rect);
            height -= rect.height;
          })
          console.log('height');
          console.log(height);
          self.setData({
            scrollHeight: height
          });
        }).exec();
      }
    });
  },
  addressFind: function () {
    var self = this;
    app.request('weixin/address/find', {
      method: 'POST',
      data: { pageSize: self.addressPageSize, currentPage: self.addressCurrentPage, weiToken: wx.getStorageSync('weiToken') },
      success: function (res) {
        var datas = res.data.data;
        console.log(datas);
        self.setData({
          addressList: datas
        });
      }
    }, self.addressFind);
  },
  toAddress: function() {
    wx.navigateTo({
      url: '../address/address'
    })
  },
  edit: function(e) {
    console.log(e.currentTarget.dataset.item);
    wx.setStorageSync("addr", JSON.stringify(e.currentTarget.dataset.item));
    wx.navigateTo({
      url: '../address/address'
    })
  },
  del: function(e) {
    console.log(e.currentTarget.dataset);
    var id = e.currentTarget.dataset.item._id;
    var index = e.currentTarget.dataset.index;
    console.log(id + "---" + index);
    this.addressDelete(id, index);
  },
  addressDelete: function(id, index) {
    var self = this;
    app.request('weixin/address/delState', {
      method: 'POST',
      data: { _id: id, weiToken: wx.getStorageSync('weiToken') },
      success: function (res) {
        self.data.addressList.splice(index, 1)
        self.setData({
          addressList: self.data.addressList
        })
      }
    }, function(){self.addressDelete(id, index)});
  },
  stateChange: function(e) {
    var id = e.currentTarget.dataset.item._id;
    var index = e.currentTarget.dataset.index;
    var state = e.currentTarget.dataset.item.state;
    console.log(id + "---" + index + "---" + state);
    if(state == 1) {
      return;
    }
    this.stateChangeReq(id, index);
  },
  stateChangeReq: function (id, index) {
    var self = this;
    app.request('weixin/address/state', {
      method: 'POST',
      data: { _id: id, weiToken: wx.getStorageSync('weiToken') },
      success: function (res) {
        console.log("address/state res");
        console.log(res);
        var addressList = self.data.addressList;
        for (var i = 0; i < addressList.length; i++) {
          if(i == index) {
            addressList[i]["state"] = 1;
          } else {
            addressList[i]["state"] = 0;
          }
        }
        self.setData({
          addressList: addressList
        })
        if (self.data.page == "balance") {
          wx.removeStorageSync("page");
          wx.navigateTo({
            url: '../balance/balance'
          })
        }
      }
    }, function () { self.stateChangeReq(id, index) });
  }
})