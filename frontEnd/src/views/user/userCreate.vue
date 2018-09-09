<template>
  <div>
    <div class="form">
      <p class="title">{{form._id? "修改": "新增"}}用户</p>
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="用户名">
          <el-input v-model="form.name" placeholder="name"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="form.password" placeholder="password"></el-input>
        </el-form-item>
        <el-form-item label="token">
          <el-input v-model="form.token" placeholder="token"></el-input>
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
</style>
<script>
export default {
  name: 'login',
  data () {
    return{
      form: {
        name: "",
        password: "",
        token: ""
      }
    }
  },
  created: function() {
    var self = this;
    var user = localStorage.getItem('user');
    if(user && !self.isEmptyObject(user)) {
      this.form = JSON.parse(user);
      localStorage.removeItem('user');
    }
  },
  methods:{
    submit: function() {
      var self = this;
      self.form.password = self.encrypt(self.form.password);
      if(self.form._id) {
        self.request("api/user/createAndUpdate",{
          "method":"POST",
          "data": self.form,
          "success": function(res){
            self.jump("/main/user");
          }
        });
      } else {
        self.request("api/signup",{
          "method":"POST",
          "data": self.form,
          "success": function(res){
            self.jump("/main/user");
          }
        });
      }
    }
  }
}
</script>