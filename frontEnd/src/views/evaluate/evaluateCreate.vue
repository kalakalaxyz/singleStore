<template>
  <div>
    <div class="form">
      <p class="title">{{form._id? "修改": "新增"}}评价</p>
      <div style="display:flex;flex-direction:row;">
        <div v-for="(img, index) in imgs" class="upload bgsize rel" :style="{'background-image': 'url('+img+')'}">
          <div @click="del(index)" class="del">X</div>
        </div>
        <div class="upload" v-show="imgs.length < 3" :style="{'background-image': 'url('+imgInput+')'}">
          <input type="file" name="imgs" id="photo" @change="onfilechange">
        </div>
      </div>
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="图标地址">
          <el-input v-model="form.avatarUrl" placeholder="avatarUrl"></el-input>
        </el-form-item>
        <el-form-item label="配送星">
          <el-input v-model="form.sendStar" placeholder="sendStar"></el-input>
        </el-form-item>
        <el-form-item label="口味星">
          <el-input v-model="form.tasteStar" placeholder="tasteStar"></el-input>
        </el-form-item>
        <el-form-item label="包装星">
          <el-input v-model="form.packStar" placeholder="packStar"></el-input>
        </el-form-item>
        <el-form-item label="说明">
          <el-input v-model="form.explain" placeholder="explain"></el-input>
        </el-form-item>
        <el-form-item label="openid">
          <el-input v-model="form.openid" placeholder="openid"></el-input>
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
.bgsize{
  background-size:200px 200px;
}

.upload:hover {
    color: #444;
    background: #eee;
    border-color: #ccc;
    text-decoration: none
}
.rel{position:relative;}
.del{position:absolute;right:0;top:0;width:20px;height:20px;text-align: center;line-height: 20px;border-radius:50%;border:1px solid red;}

</style>
<script>
export default {
  name: 'login',
  data () {
    return{
      form: {
        avatarUrl: "",
        sendStar: "",
        tasteStar: "",
        packStar: "",
        explain: "",
        openid: "",
        imgs: [],
        delId: 0
      },
      imgs: [],
      imgInput: ""
    }
  },
  created: function() {
    var self = this;
    self.imgInput = self.const().IP + "public/images/upload.png";
    var evaluate = localStorage.getItem('evaluate');
    if(evaluate && !self.isEmptyObject(evaluate)) {
      self.form = JSON.parse(evaluate);
      for(let i = 0;i < self.form.imgs.length; i++) {
        console.log(self.form.imgs[i]);
        self.imgs[i] = self.const().IP + self.form.imgs[i];
      }
      localStorage.removeItem('evaluate');
    }
  },
  methods:{
    submit: function() {
      var self = this;
      self.request("api/evaluate/createAndUpdate",{
        "method":"POST",
        "data": self.form,
        "success": function(res){
          self.jump("/main/evaluate");
        }
      });
    },
    onfilechange: function(e) {
      var self = this;
      self.imgUpload(e, function(res) {
        self.form.imgs.push(res.data.data);
        self.imgs.push(self.const().IP + res.data.data);
      })
    },
    del: function(index) {
      this.form.imgs.splice(index, 1);
      this.imgs.splice(index, 1);
    }
  }
}
</script>