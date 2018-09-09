<template>
  <div>
    <div class="form">
      <p class="title">{{form._id? "修改": "新增"}}商品</p>
      <div class="upload" :style="{'background-image': 'url('+img+')'}">
        <input type="file" name="photo" id="photo" @change="onfilechange">
      </div>
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="商品名">
          <el-input v-model="form.name" placeholder="name"></el-input>
        </el-form-item>
        <el-form-item label="说明">
          <el-input v-model="form.explain" placeholder="explain"></el-input>
        </el-form-item>
        <el-form-item label="月售">
          <el-input v-model="form.sendNum" placeholder="sendNum"></el-input>
        </el-form-item>
        <el-form-item label="总销量">
          <el-input v-model="form.totalNum" placeholder="totalNum"></el-input>
        </el-form-item>
        <el-form-item label="好评">
          <el-input v-model="form.praise" placeholder="praise"></el-input>
        </el-form-item>
        <el-form-item label="价格">
          <el-input v-model="form.price" placeholder="price"></el-input>
        </el-form-item>
        <el-form-item label="售完">
          <el-input v-model="form.sellout" placeholder="sellout"></el-input>
        </el-form-item>
        <el-form-item label="delId">
          <el-input v-model="form.delId" placeholder="delId"></el-input>
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

</style>
<script>
import io from 'socket.io-client'
export default {
  name: 'login',
  data () {
    return{
      form: {
        name: "",
        explain: "",
        sendNum: 0,
        totalNum: 0,
        praise: "",
        price: "",
        photo: "",
        sellout: 0,
        delId: 0
      },
      img: "",
      selloutInit: null
    }
  },
  created: function() {
    var self = this;
    self.img = self.const().IP + "public/images/upload.png";
    var goods = localStorage.getItem('goods');
    if(goods && !self.isEmptyObject(goods)) {
      self.form = JSON.parse(goods);
      self.img = self.const().IP + self.form.photo;
      self.selloutInit = self.form.sellout;
      localStorage.removeItem('goods');
    }
  },
  methods:{
    submit: function() {
      var self = this;
      self.request("api/goods/createAndUpdate",{
        "method":"POST",
        "data": self.form,
        "success": function(res){
          console.log("submit res");
          console.log(res);
          var resConfigData = JSON.parse(res.config.data);
          console.log(resConfigData);
          //只有修改才通知，且在使用状态
          if(!resConfigData._id ||  self.selloutInit != resConfigData.sellout) {
              var socket = io.connect(self.const().IP);
              socket.emit('goodsSellout', {
                _id: resConfigData._id || res.data.data._id,
                sellout: resConfigData.sellout
              });
          }
          self.jump("/main/goods");
        }
      });
    },
    onfilechange: function(e) {
      var self = this;
      self.imgUpload(e, function(res) {
        self.form.photo = res.data.data;
        self.img = self.const().IP + res.data.data;
      })
    }
  }
}
</script>