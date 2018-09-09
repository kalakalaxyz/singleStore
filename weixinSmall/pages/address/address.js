const app = getApp();
Page({
  data: {
    xiamenAddr: ["厦门市软件园二期", "厦门市观音山"],
    index: 0,
    tags: [],
    tagIndex: 1,
    stateIndex: 0,
    states: ["保存","使用"],
    name: "",
    phone: "",
    detailAddr: "",
    addr: {}
  },
  onLoad: function () {
    var self = this;
    this.setData({
      tags: app.globalData.tags
    })
    var addr = wx.getStorageSync("addr");
    wx.removeStorageSync("addr");
    console.log(addr);
    console.log(addr.length);
    if(addr) {
      addr = JSON.parse(addr);
      console.log(self.data.xiamenAddr.indexOf(addr.addr));
      this.setData({
        addr: addr
      })
      this.setData({
        name: addr.name
      })
      this.setData({
        phone: addr.phone
      })
      this.setData({
        index: self.data.xiamenAddr.indexOf(addr.addr)
      })
      this.setData({
        detailAddr: addr.detailAddr
      })
      this.setData({
        tagIndex: addr.tag
      })
      this.setData({
        stateIndex: addr.state
      })
    }
  },
  bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value
    })
  },
  chooseTag: function (e) {
    this.setData({
      tagIndex: parseInt(e.currentTarget.dataset.index)
    })
  },
  // chooseState: function (e) {
  //   this.setData({
  //     stateIndex: parseInt(e.currentTarget.dataset.index)
  //   })
  // },
  inputName: function(e) {
    this.setData({
      name: e.detail.value
    })
  },
  inputPhone: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },
  inputDetailAddr: function (e) {
    this.setData({
      detailAddr: e.detail.value
    })
  },
  submit: function() {
    var self = this;
    var obj = {
      name: self.data.name,
      phone: self.data.phone,
      addr: self.data.xiamenAddr[self.data.index],
      detailAddr: self.data.detailAddr,
      tag: self.data.tagIndex,
      state: self.data.stateIndex
    }
    if(self.data.addr._id) {
      obj._id = self.data.addr._id;
    }
    console.log("提交前数据");
    console.log(obj)
    self.addrCreate(obj);
  },
  addrCreate: function(obj) {
    var self = this;
    obj.weiToken = wx.getStorageSync('weiToken');
    app.request('weixin/address/createAndUpdate', {
      method: 'POST',
      data: obj,
      success: function (res) {
        var datas = res.data.data;
        console.log(datas);
        wx.navigateTo({
          url: '../addressList/addressList'
        })
      }
    }, function (){self.addrCreate(obj)});
  }
})