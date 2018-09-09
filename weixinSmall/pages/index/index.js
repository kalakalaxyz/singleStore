const app = getApp();
const io = require("../../lib/weapp.socket.io.js");
const util = require("../../utils/util.js");
Page({
  data: {
    host: "",
    navbar: ['点餐', '评价', '商家'],
    currentTab: 0,
    goods:[],
    goods2: [],
    shopcartImg0: "../../images/shopcart0.png",
    shopcartImg: "../../images/shopcart.png",
    totalNum: 0,
    totalMoney: 0,
    shopcartList: [],
    shopcartShow: false,
    evaluateList: [],
    evaluatePageSize: 10,
    evaluateCurrentPage: 1,
    seller: {},
    scrollHeight: 300,
    evaluateTotal: 0,
    sellerRest: 0, //商家休息，0未休息，1休息
    evaluateSwitch: true
  },
  onLoad: function () {
    var self = this,
      currentTab = self.data.currentTab;
    self.setData({
      host: app.globalData.host
    });
    if (currentTab == 0) {
      self.goodsFind();
    } else if (currentTab == 1) {
      self.evaluateFind();
    } else if (currentTab == 2) {
      self.sellerFind();
    }
    app.login();
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
    const socket = io(app.globalData.host);
    socket.on('sellerRest', function (data) {
      console.log("sellerRest========");
      console.log(data);
      console.log("typeof data");
      console.log(typeof data);
      app.globalData.sellerRest = data;
      self.setData({
        sellerRest: data
      });
    });
    socket.on('goodsSellout', function (data) {
      console.log("goodsSellout========");
      console.log(data);
      var goods = self.data.goods;
      for (var i = 0; i < goods.length; i++) {
        if (goods[i]._id == data._id) {
          goods[i].sellout = data.sellout;
          if (goods[i].num) {
            console.log("goods[i].num==: " + goods[i].num);
            var totalNum = 0,
              totalMoney = 0;
            totalNum = self.data.totalNum - goods[i].num;
            totalMoney = self.data.totalMoney - goods[i].num * goods[i].price;
            self.setData({
              totalNum: totalNum
            });
            self.setData({
              totalMoney: totalMoney
            });
            var shopcartList = self.data.shopcartList;
            for (var j = 0; j < shopcartList.length; j++) {
              if (shopcartList[j]._id = data._id) {
                shopcartList.splice(j, 1);
              }
            }
          }
          goods[i].num = 0;
          self.setData({
            goods: goods
          });
          self.setData({
            goods2: self.data.goods
          });
        }
      }
      var selloutId = app.globalData.selloutId;
      if(data.sellout == 0) {
        for(var i = 0; i < selloutId.length; i++) {
          if (selloutId[i] == data._id) {
            app.globalData.selloutId.splice(i, 1);
          }
        }
      } else if (data.sellout == 1) {
        app.globalData.selloutId.push(data._id);
      }
    });
    socket.on('businessTime', function (data) {
      console.log("businessTime========");
      console.log(data);
      app.globalData.timeFrom = data.businessTimeFrom;
      app.globalData.timeTo = data.businessTimeTo;
      var businessTime = "",
        businessTimeFrom = data.businessTimeFrom.split("-"),
        businessTimeTo = data.businessTimeTo.split("-");
      for (var i = 0; i < businessTimeFrom.length; i++) {
        businessTime += businessTimeFrom[i] + "-" + businessTimeTo[i] + "、"
      }
      businessTime.slice(0, businessTime.length - 1);
      self.data.seller.businessTime = businessTime;
      self.setData({
        seller: self.data.seller
      })
    });
  },
  goodsFind: function() {
    var self = this;
    app.request('weixin/goods/find', {
      method: 'POST',
      data: {},
      success: function (res) {
        var datas = res.data.data;
        console.log("goods data");
        console.log(datas);
        for (var i = 0; i < datas.length; i++) {
          datas[i].num = 0;
          if (datas[i].sellout == 1) {
            app.globalData.selloutId.push(datas[i]._id);
          }
        }
        self.setData({
          goods: datas
        });
        self.setData({
          goods2: self.data.goods
        });
      }
    });
  },
  evaluateFind: function() {
    var self = this;
    app.request('weixin/evaluate/find', {
      method: 'POST',
      data: { pageSize: self.data.evaluatePageSize, currentPage: self.data.evaluateCurrentPage },
      success: function (res) {
        var datas = res.data.data;
        console.log("evaluate data");
        console.log(datas);
        self.setData({
          evaluateList: datas
        });
        self.setData({
          evaluateTotal: res.data.total
        });
      }
    });
  },
  sellerFind: function() {
    var self = this;
    app.request('weixin/seller/findOne', {
      method: 'POST',
      data: {},
      success: function (res) {
        var datas = res.data.data,
          businessTimeFrom = datas.businessTimeFrom.split("-"),
          businessTimeTo = datas.businessTimeTo.split("-");
        console.log("seller data");
        console.log(datas);
        var businessTime = "";
        for (var i = 0; i < businessTimeFrom.length; i++) {
          businessTime += businessTimeFrom[i] + "-" + businessTimeTo[i] + "、"
        }
        businessTime.slice(0, businessTime.length - 1);
        datas.businessTime = businessTime;
        self.setData({
          seller: datas
        });
        app.globalData.sellerRest = datas.rest;
        self.setData({
          sellerRest: datas.rest
        });
        console.log("typeof datas.rest");
        console.log(typeof datas.rest);
        app.globalData.timeFrom = datas.businessTimeFrom;
        app.globalData.timeTo = datas.businessTimeTo;
      }
    })
  },
  toOrderList: function() {
    wx.navigateTo({
      url: '../orderList/orderList'
    })
  },
  toMine: function () {
    wx.navigateTo({
      url: '../mine/mine'
    })
  },
  navbarTap: function (e) {
    var self = this;
    var idx = e.currentTarget.dataset.idx;
    this.setData({
      currentTab: idx
    })
    if (idx == 0) {
      self.goodsFind();
      self.setData({
        totalNum: 0
      });
      self.setData({
        totalMoney: 0
      });
      self.setData({
        shopcartList: []
      })
    } else if (idx == 1) {
      self.evaluateFind();
    } else if (idx == 2) {
      self.sellerFind();
    }
  },
  minus: function (e) {
    var self = this,
        item = e.currentTarget.dataset.item,
        _id = item._id,
        num = item.num,
        totalNum = 0,
        totalMoney = 0,
        shopcartList = [];
    if(num) {
      //设置页面加数据变化
      for (var i = 0; i < self.data.goods.length; i++) {
        if (self.data.goods[i]._id == _id) {
          self.data.goods[i].num = parseInt(self.data.goods[i].num) - 1;
          self.setData({
            goods: self.data.goods
          })
        }
      }
      //设置购物车加数据变化
      for (var i = 0; i < self.data.goods.length; i++) {
        if (self.data.goods[i].num) {
          totalNum += self.data.goods[i].num;
          totalMoney += parseInt(self.data.goods[i].num) * parseInt(self.data.goods[i].price);
          shopcartList.push(self.data.goods[i]);
        }
      };
      self.setData({
        totalNum: totalNum
      });
      self.setData({
        totalMoney: totalMoney
      });
      self.setData({
        shopcartList: shopcartList
      });
    }
  },
  plus: function (e) {
    var self = this,
        item = e.currentTarget.dataset.item,
        _id = item._id,
        totalNum = 0,
        totalMoney = 0,
        shopcartList = [];
    //设置页面加数据变化
    if (app.globalData.sellerRest == 0) {
      if(item.sellout == 0) {
        for (var i = 0; i < self.data.goods.length; i++) {
          if (self.data.goods[i]._id == _id) {
            self.data.goods[i].num = parseInt(self.data.goods[i].num) + 1;
            self.setData({
              goods: self.data.goods
            })
          }
        };
        //设置购物车加数据变化
        for (var i = 0; i < self.data.goods.length; i++) {
          if (self.data.goods[i].num) {
            totalNum += self.data.goods[i].num;
            totalMoney += parseInt(self.data.goods[i].num) * parseInt(self.data.goods[i].price);
            shopcartList.push(self.data.goods[i]);
          }
        };
        self.setData({
          totalNum: totalNum
        });
        self.setData({
          totalMoney: totalMoney
        });
        self.setData({
          shopcartList: shopcartList
        });
      } else {
        wx.showToast({
          title: '此商品已售完',
          duration: 1000
        })
      }
    } else {
      wx.showToast({
        title: '商家休息',
        duration: 1000
      })
    }
  },
  shopcartShow: function() {
    var self = this;
    if (self.data.totalNum) {
      self.setData({
        shopcartShow: !self.data.shopcartShow
      })
    }
  },
  clearAll: function() {
    var self = this;
    self.setData({
      totalNum: 0
    });
    self.setData({
      totalMoney: 0
    });
    self.setData({
      shopcartList: []
    });
    self.setData({
      goods: this.data.goods2
    });
    self.setData({
      shopcartShow: false
    })
  },
  toBalance: function() {
    var self = this;
    if (app.globalData.sellerRest == 0) {
      if (!util.isAfterTime()) {
        var shopcart = {
          totalNum: self.data.totalNum,
          totalMoney: self.data.totalMoney,
          shopcartList: self.data.shopcartList
        }
        wx.setStorageSync("shopcart", JSON.stringify(shopcart));
        wx.navigateTo({
          url: '../balance/balance'
        });
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
  evaluateRefresh: function() {
    var self = this;
    app.request('weixin/evaluate/find', {
      method: 'POST',
      data: { pageSize: self.data.evaluatePageSize, currentPage: 1 },
      success: function (res) {
        var datas = res.data.data;
        self.setData({
          evaluateList: datas
        });
      }
    });
  },
  evaluateLoadMore: function() {
    var self = this;
    console.log("self.data.evaluateList.length------self.data.evaluateTotal");
    console.log(self.data.evaluateList.length+"------"+self.data.evaluateTotal);
    if (self.data.evaluateList.length < self.data.evaluateTotal) {
      if (self.data.evaluateSwitch) {
        self.setData({
          evaluateSwitch: false
        });
        var evaluateCurrentPage = self.data.evaluateCurrentPage + 1;
        app.request('weixin/evaluate/find', {
          method: 'POST',
          data: { pageSize: self.data.evaluatePageSize, currentPage: evaluateCurrentPage },
          success: function (res) {
            var datas = res.data.data;
            self.setData({
              evaluateList: datas
            });
            self.setData({
              evaluateCurrentPage: evaluateCurrentPage
            });
            self.setData({
              evaluateSwitch: true
            });
          }
        });
      }
    } else {
      wx.showToast({
        title: '没有更多数据',
        duration: 3000
      })
    }
  }
})