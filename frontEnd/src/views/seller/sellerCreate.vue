<template>
  <div>
    <div class="form">
      <p class="title">{{form._id? "修改": "新增"}}商家</p>
      <div>
        <span style="float:left">主图</span>
        <div class="upload" :style="{'background-image': 'url('+mainImg+')'}">
          <input type="file" name="photo" @change="onfilechangeMainImg">
        </div>
      </div>

      <div style="display:flex;flex-direction:row;">
        <span>店铺图片</span>
        <div v-for="(img, index) in storeImgs" class="upload bgsize rel" :style="{'background-image': 'url('+img+')'}">
          <div @click="del(index, 'storeImgs')" class="del">X</div>
        </div>
        <div class="upload" v-show="storeImgs.length < 3" :style="{'background-image': 'url('+imgInput+')'}">
          <input type="file" name="photo" @change="onfilechangeStoreImg">
        </div>
      </div>

      <div style="display:flex;flex-direction:row;">
        <span>营业资质图片</span>
        <div v-for="(img, index) in businessImgs" class="upload bgsize rel" :style="{'background-image': 'url('+img+')'}">
          <div @click="del(index, 'businessImgs')" class="del">X</div>
        </div>
        <div class="upload" v-show="businessImgs.length < 4" :style="{'background-image': 'url('+imgInput+')'}">
          <input type="file" name="photo" @change="onfilechangeBusinessImg">
        </div>
      </div>

      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="店名">
          <el-input v-model="form.storeName" placeholder="name"></el-input>
        </el-form-item>
        <el-form-item label="距离">
          <el-input v-model="form.distance" placeholder="explain"></el-input>
        </el-form-item>
        <el-form-item label="送达需时">
          <el-input v-model="form.sendTime" placeholder="sendNum"></el-input>
        </el-form-item>
        <el-form-item label="月售">
          <el-input v-model="form.saleNum" placeholder="praise"></el-input>
        </el-form-item>
        <el-form-item label="配送信息1">
          <el-input v-model="form.distribute1" placeholder="price"></el-input>
        </el-form-item>
        <el-form-item label="配送信息2">
          <el-input v-model="form.distribute2" placeholder="price"></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="form.phone" placeholder="sendNum"></el-input>
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="form.addr" placeholder="praise"></el-input>
        </el-form-item>
        <el-form-item label="营业时间起">
          <el-input v-model="form.businessTimeFrom" placeholder="price"></el-input>
        </el-form-item>
        <el-form-item label="营业时间止">
          <el-input v-model="form.businessTimeTo" placeholder="price"></el-input>
        </el-form-item>
        <el-form-item label="使用状态">
          <el-input v-model="form.state" placeholder="state"></el-input>
        </el-form-item>
        <el-form-item label="休息情况">
          <el-input v-model="form.rest" placeholder="rest"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submit">提交</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<style scoped>
.form{width: 500px;margin: 0 auto;}
.title{text-align: center;}
.upload {
    width:200px;
    height: 200px;
    line-height: 200px;
    position: relative;
    cursor: pointer;
    color: #888;
    background: #fafafa;
    border: 1px solid #ddd;
    border-radius: 4px;
    overflow: hidden;
    display: inline-block;
    *display: inline;
    *zoom: 1
}

.upload  input {
    position: absolute;
    font-size: 100px;
    right: 0;
    top: 0;
    opacity: 0;
    filter: alpha(opacity=0);
    cursor: pointer
}

.upload:hover {
    color: #444;
    background: #eee;
    border-color: #ccc;
    text-decoration: none
}
.bgsize{
  background-size:200px 200px;
}

.rel{position:relative;}
.del{position:absolute;right:0;top:0;width:20px;height:20px;text-align: center;line-height: 20px;border-radius:50%;border:1px solid red;}
</style>
<script>
  import io from 'socket.io-client'
export default {
  name: 'login',
  data () {
    return{
      form: {
        storeName: "",
        mainImg: "",
        distance: "",
        sendTime: "",
        saleNum: "",
        distribute1: "",
        distribute2: "",
        storeImgs: [],
        phone: "",
        addr: "",
        businessTimeFrom: "",
        businessTimeTo: "",
        businessImgs: [],
        state: 0,
        rest: 0
      },
      mainImg: "",
      storeImgs: [],
      businessImgs: [],
      imgInput: "",
      restInit: "",
      businessTimeFromInit: "",
      businessTimeToInit: ""
    }
  },
  created: function() {
    var self = this;
    self.mainImg = self.const().IP + "public/images/upload.png";
    self.imgInput = self.const().IP + "public/images/upload.png";
    var seller = localStorage.getItem('seller');
    if(seller && !self.isEmptyObject(seller)) {
      self.form = JSON.parse(seller);
      self.mainImg = self.const().IP + self.form.mainImg;
      self.restInit = self.form.rest;
      self.businessTimeFromInit = self.form.businessTimeFrom;
      self.businessTimeToInit = self.form.businessTimeTo;
      for(let i = 0;i < self.form.storeImgs.length; i++) {
        console.log(self.form.storeImgs[i]);
        self.storeImgs[i] = self.const().IP + self.form.storeImgs[i];
      }
      for(let i = 0;i < self.form.businessImgs.length; i++) {
        console.log(self.form.businessImgs[i]);
        self.businessImgs[i] = self.const().IP + self.form.businessImgs[i];
      }
      localStorage.removeItem('seller');
    }
  },
  methods:{
    submit: function() {
      var self = this;
      self.request("api/seller/createAndUpdate",{
        "method":"POST",
        "data": self.form,
        "success": function(res){
          console.log("seller createAndUpdate res");
          console.log(res);
          var resConfigData = JSON.parse(res.config.data);
          console.log(resConfigData);
          //只有修改才通知，且在使用状态
          if(resConfigData._id && resConfigData.state == 1 && self.restInit != resConfigData.rest) {
            var socket = io.connect(self.const().IP);
            socket.emit('sellerRest', resConfigData.rest);
          }
          if(resConfigData._id && resConfigData.state == 1 && (self.businessTimeFromInit != resConfigData.businessTimeFrom || self.businessTimeToInit != resConfigData.businessTimeTo)) {
            var socket = io.connect(self.const().IP);
            socket.emit('businessTime', {
              businessTimeFrom: resConfigData.businessTimeFrom,
              businessTimeTo: resConfigData.businessTimeTo
            });
          }
          self.jump("/main/seller");
        }
      });
    },
    onfilechangeMainImg: function(e) {
      var self = this;
      self.imgUpload(e, function(res) {
        self.form.mainImg = res.data.data;
        self.mainImg = self.const().IP + res.data.data;
      })
    },
    onfilechangeStoreImg: function(e) {
      var self = this;
      self.imgUpload(e, function(res) {
        self.form.storeImgs.push(res.data.data);
        self.storeImgs.push(self.const().IP + res.data.data);
      })
    },
    onfilechangeBusinessImg: function(e) {
      var self = this;
      self.imgUpload(e, function(res) {
        self.form.businessImgs.push(res.data.data);
        self.businessImgs.push(self.const().IP + res.data.data);
      })
    },
    del: function(index, kind) {
      this.form[kind].splice(index, 1);
      this[kind].splice(index, 1);
    }
  }
}
</script>