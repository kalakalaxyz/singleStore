<template>
  <div>
    <div class="form">
      <p class="title">登录页面</p>
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="用户名">
          <el-input v-model="form.name" placeholder="name"></el-input>
        </el-form-item>
        <el-form-item label="phone">
          <el-input v-model="form.phone" placeholder="phone"></el-input>
        </el-form-item>
        <el-form-item label="addr">
          <el-input v-model="form.addr" placeholder="addr"></el-input>
        </el-form-item>
        <el-form-item label="detailAddr">
          <el-input v-model="form.detailAddr" placeholder="detailAddr"></el-input>
        </el-form-item>
        <el-form-item label="tag">
          <el-input v-model="form.tag" placeholder="tag"></el-input>
        </el-form-item>
        <el-form-item label="openid">
          <el-input v-model="form.openid" placeholder="openid"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addressCreate">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<style scoped>
.form{width: 500px;margin: 0 auto;}
.title{text-align: center;}
</style>
<script>
export default {
  name: 'login',
  data () {
  	return{
      form: {
        name: "",
        phone: "",
        addr: "",
        detailAddr: "",
        tag: "",
        openid: ""
      }
    }
  },
  methods:{
    addressCreate: function() {
      var self = this;
      self.request("api/address",{
        "method":"POST",
        "data": self.form,
        "success": function(res){
          
          console.log(res);
          
        }
      });
    }
  }
}
</script>