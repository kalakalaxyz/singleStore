const app = getApp();
Page({
  data: {
    distributionNum: 4,
    tasteNum: 4,
    packNum: 4,
    textarea: "",
    imgSrc: [],
    userInfo: "",
    imgs: []
  },
  onLoad: function () {
    this.setData({ userInfo: app.globalData.userInfo});
    console.log("userInfo");
    console.log(app.globalData.userInfo);
  },
  distribution: function (e) {
    this.setData({
      distributionNum: e.currentTarget.dataset.index
    })
  },
  taste: function (e) {
    this.setData({
      tasteNum: e.currentTarget.dataset.index
    })
  },
  pack: function (e) {
    this.setData({
      packNum: e.currentTarget.dataset.index
    })
  },
  bindTextAreaBlur: function (e) {
    this.setData({
      textarea: e.detail.value
    })
  },
  imgUpload: function () {
    var self = this
    wx.chooseImage({
      count: 3, // 最多可以选择的图片张数，默认9
      sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function (res) {
        self.setData({
          imgSrc: res.tempFilePaths
        })
        self.setData({
          imgs: []
        })
        for (var i = 0; i < res.tempFilePaths.length; i++) { 
          wx.uploadFile({
            url: app.globalData.host + "weixin/image/upload",
            filePath: res.tempFilePaths[i],
            name: 'photo',
            header: {
              'content-type': 'multipart/form-data'
            },
            formData: {
              'imgIndex': i
            },  
            success: function (resUpload) {
              console.log('resUpload');
              console.log(resUpload.data);
              var data = JSON.parse(resUpload.data);
              data = data.data;
              console.log(data);
              var index = data.indexOf("public/images");
              data = "./" + data.slice(index);
              console.log(data);
              var imgs = self.data.imgs;
              imgs.push(data);
              self.setData({
                imgs: imgs
              })
            },
            fail: function (res) {
            },
            compile: function (res) {
            }
          })
        }
      },
      fail: function () {
      },
      complete: function () {
      }
    })
  },
  submit: function() {
    var self = this,
        formData = {
          avatarUrl: app.globalData.userInfo.avatarUrl ? app.globalData.userInfo.avatarUrl: "",
          sendStar: self.data.distributionNum,
          tasteStar: self.data.tasteNum,
          packStar: self.data.packNum,
          explain: self.data.textarea,
          imgs: self.data.imgs
        };
    console.log("evaluate submit formData");
    console.log(formData);
    self.evaluateCreate(formData);
  },
  evaluateCreate: function (obj) {
    var self = this,
        weiToken = wx.getStorageSync('weiToken');
    obj.weiToken = weiToken;
    app.request('weixin/evaluate/createAndUpdate', {
      method: 'POST',
      data: obj,
      success: function (res) {
        var datas = res.data.data;
        console.log(datas);
        var order = JSON.parse(wx.getStorageSync("order"));
        console.log("订单id" + order._id);
        var objEvaluate = {};
        objEvaluate.weiToken = weiToken;
        objEvaluate.orderId = order._id;
        app.request('weixin/order/evaluate', {
          method: 'POST',
          data: objEvaluate,
          success: function (resEvaluate) {
            wx.navigateTo({
              url: '../index/index'
            })
          }
        });
      }
    }, function () { self.evaluateCreate(obj) });
  }
})