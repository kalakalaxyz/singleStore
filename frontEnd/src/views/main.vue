<template>
<div>
  <el-menu
    :default-active="index"
    class="el-menu-demo"
    mode="horizontal"
    @select="handleSelect"
    background-color="#545c64"
    text-color="#fff"
    active-text-color="#ffd04b">
    <el-menu-item index="address">地址管理</el-menu-item>
    <el-menu-item index="evaluate">评价管理</el-menu-item>
    <el-menu-item index="goods">商品管理</el-menu-item>
    <el-menu-item index="order">订单管理</el-menu-item>
    <el-menu-item index="user">用户管理</el-menu-item>
    <el-menu-item index="weiUser">微信用户管理</el-menu-item>
    <el-menu-item index="seller">商家</el-menu-item>
    <el-menu-item index="count">统计</el-menu-item>
    <el-menu-item index="signout" style="float:right;">退出</el-menu-item>
  </el-menu>
  <router-view></router-view>
</div>
</template>
<script>
export default {
  data () {
  	return{
      index: 'address'
    }
  },
  methods:{
    handleSelect(key, keyPath) {
      var self = this;
      if(key == "signout") {
        self.request("api/user/signout",{
          "method":"POST",
          "data": {token: localStorage.getItem('token')},
          "success": function(res){
            if(res.data.success) {
              localStorage.clear();
              self.jump("/login");
            } else {
              alert(res.data.data);
              localStorage.clear();
            }
          }
        });
      }else {
        self.jump("/main/" + key);
      }
    }
  }
}
</script>
<style scoped>

</style>
