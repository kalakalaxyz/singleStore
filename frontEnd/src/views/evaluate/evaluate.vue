<template>
  <div>
    <el-row class="mt20b20">
      <el-button type="primary" @click="create">新增</el-button>
    </el-row>

    <div style="width:1200px;margin:auto;">
      <el-table :data="dataList" border style="width: 100%;" header-cell-style="text-align:center;" @cell-click="showPic">
        <el-table-column prop="_id" label="_id" width="50" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="avatarUrl" label="图标地址" width="50" :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column prop="sendStar" label="配送星" width="50"></el-table-column>
        <el-table-column prop="tasteStar" label="口味星" width="50"></el-table-column>
        <el-table-column prop="packStar" label="包装星" width="50"></el-table-column>
        <el-table-column prop="explain" label="说明" width="100"></el-table-column>
        <el-table-column prop="imgs" label="图片地址" width="390" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="openid" label="openid" width="190" :show-overflow-tooltip="true"></el-table-column>
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
      this.jump("/main/evaluateCreate");
    },
    update(row) {
      var evaluate = {
        _id: row._id,
        avatarUrl: row.avatarUrl,
        sendStar: row.sendStar,
        tasteStar: row.tasteStar,
        packStar: row.packStar,
        explain: row.explain,
        imgs: row.imgs,
        openid: row.openid,
        delId: row.delId
      }
      localStorage.setItem('evaluate',JSON.stringify(evaluate));
      this.jump("/main/evaluateCreate");

    },
    deletes(id) {
      var self = this;
      self.request("api/evaluate/delete",{
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
    showPic(row, column, cell, event){
      var self = this;
      if(column.label == "图片地址") {
        var str ='<div style="text-align:center;display:flex;flex-direction:row;">';
        for(var i = 0; i < row.imgs.length; i++) {
          str += '<img style="border:1px solid #eee;" src="' + self.const().IP + row.imgs[i] + '"/>'
        }
        str += '</div>'
        self.$alert(str, '图片效果', {
          dangerouslyUseHTMLString: true
        });
      }

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
        pageSize: self.pageSize,
        currentPage: self.currentPage
      };
      self.request("api/evaluate/find",{
        "method":"POST",
        "data": obj,
        "success": function(res){
          if(res.data.success) {
            console.log(res.data.data);
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