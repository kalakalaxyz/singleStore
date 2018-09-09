<template>
  <div>
    <div class="form">
      <p class="title">登录页面</p>
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="用户名">
          <el-input v-model="form.name" placeholder="请选择用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="form.password" placeholder="请选择密码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="primary" @click="signup">注册</el-button>
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
        name: '',
        password: ''
      }
    }
  },
  created: function() {
    // console.log("location.href---");
    // console.log(location.href);
    // var url = location.href.replace("http://","https://");
    // console.log(url);
    // location.href = url;
  },
  methods:{
    login: function() {
      var self = this;
      self.request("api/user/login",{
        "method":"POST",
        "data": {name: self.form.name,password: self.encrypt(self.form.password)},
        "success": function(res){
          if(res.data.success) {
            localStorage.setItem('token',res.data.token);
            self.jump("/main/address");
          } else {
            alert(res.data.data);
          }
        }
      });
    },
    signup: function() {
      var self = this;
      self.request("api/signup",{
        "method":"POST",
        "data": {name: self.form.name,password: self.encrypt(self.form.password)},
        "success": function(res){
          console.log(res);
        }
      });
    }
  }
}
</script>