<template>
  <div>
<!-- 搜索模块 -->
    <el-row :gutter="20" class="mt20b20">
      <el-col :span="4">
        <el-input placeholder="姓名" prefix-icon="el-icon-search" v-model="name"></el-input>
      </el-col>
      <el-col :span="5">
        <el-input placeholder="电话" prefix-icon="el-icon-search" v-model="phone"></el-input>
      </el-col>
      <el-col :span="5">
        <el-input placeholder="地址" prefix-icon="el-icon-search" v-model="addr"></el-input>
      </el-col>
      <el-col :span="5">
        <el-input placeholder="具体地址" prefix-icon="el-icon-search" v-model="detailAddr"></el-input> 
      </el-col>
      <el-col :span="5">
        <el-input placeholder="openid" prefix-icon="el-icon-search" v-model="openid"></el-input> 
      </el-col>
    </el-row>
    <el-row class="mt20b20">
      <el-button type="primary" @click="create">新增</el-button>
      <el-button type="warning" @click="search">搜索</el-button>
    </el-row>
<!-- 内容 展示模块 -->
    <div style="width:1200px;margin:auto;">
      <el-table :data="dataList" border style="width: 100%" header-cell-style="text-align:center;">
        <el-table-column prop="_id" label="_id" width="50" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="name" label="姓名" width="70"></el-table-column>
        <el-table-column prop="phone" label="电话" width="110"></el-table-column>
        <el-table-column prop="addr" label="地址" width="150"></el-table-column>
        <el-table-column prop="detailAddr" label="具体地址" width="230"></el-table-column>
        <el-table-column prop="tag" label="标签" width="50"></el-table-column>
        <el-table-column prop="openid" label="openid" width="190" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="state" label="state" width="50"></el-table-column>
        <el-table-column prop="delId" label="delId" width="50"></el-table-column>
        <el-table-column prop="created" label="created" width="100" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="updated" label="updated" width="100" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button @click="update(scope.row)" type="success" size="small">修改</el-button>
            <el-button type="danger" size="small" @click="deletes(scope.row._id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
<!-- 分页模块 -->
    <div class="block mt20">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalSize">
      </el-pagination>
    </div>

  </div>
</template>
<style scoped>
.mt20b20{margin:20px 0 20px 0;}
.mb20{margin-bottom: 20px;}
.mt20{margin-top: 20px;}
</style>
<script>
export default {
  data () {
  	return{
      dataList: [],
      name: "",
      phone: "",
      addr: "",
      detailAddr: "",
      openid: "",

      currentPage: 1,
      pageSize: 10,
      totalSize: 0

    }
  },
  created:function() {
    var self = this;
    self.dataChange();
  },
  methods:{
    create: function() {
      this.jump("/main/addressCreate");
    },
    update(row) {
      var address = {
        _id: row._id,
        name: row.name,
        phone: row.phone,
        addr: row.addr,
        detailAddr: row.detailAddr,
        tag: row.tag,
        openid: row.openid,
        state: row.state,
        delId: row.delId
      }
      localStorage.setItem('address',JSON.stringify(address));
      this.jump("/main/addressCreate");

    },
    deletes(id) {
      var self = this;
      self.request("api/address/delete",{
        "method":"POST",
        "data": {_id: id},
        "success": function(res){
          if(res.data.success) {
            for(var i = 0; i < self.dataList.length; i++) {
              if(self.dataList[i]._id == id) {
                self.dataList.splice(i,1);
                self.totalSize -= 1;
              }
            }
          } else {
            self.$message(res.data.data);
          }
        }
      });
    },
    search() {
      this.currentPage = 1;
      this.dataChange();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.dataChange();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.dataChange();
    },
    dataChange() {
      var self = this;
      var obj = {
        name: self.name, 
        phone: self.phone, 
        addr: self.addr, 
        detailAddr: self.detailAddr,
        openid: self.openid,
        state: self.state,
        pageSize: self.pageSize,
        currentPage: self.currentPage
      };
      self.request("api/address/find",{
        "method":"POST",
        "data": obj,
        "success": function(res){
          console.log(res);
          if(res.data.success) {
            var data = res.data.data;
            for (var i = 0; i < data.length; i++) {
              data[i].created = self.format(new Date(data[i].created), "yyyy-MM-dd hh:mm:ss");
              data[i].updated = self.format(new Date(data[i].updated), "yyyy-MM-dd hh:mm:ss");
            }
            self.dataList = data;
            self.totalSize = res.data.total;
          } else {
            self.$message(res.data.data);
          }
        }
      });
    }
  }
}
</script>