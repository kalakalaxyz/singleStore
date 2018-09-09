<template>
  <div>
    <el-row class="mt20b20">
      <el-button type="primary" @click="create">新增</el-button>
    </el-row>

    <div style="width:1200px;margin:auto;">
      <el-table :data="dataList" border style="width: 100%" header-cell-style="text-align:center;" @cell-click="showPic">
        <el-table-column prop="_id" label="_id" width="50" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="storeName" label="店名" width="120" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="mainImg" label="主图" width="50" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="distance" label="距离" width="50"></el-table-column>
        <el-table-column prop="sendTime" label="送达时间" width="50"></el-table-column>
        <el-table-column prop="saleNum" label="月售" width="100"></el-table-column>
        <el-table-column prop="distribute1" label="配送信息1" width="50" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="distribute2" label="配送信息2" width="50" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="storeImgs" label="店铺图片" width="50" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="phone" label="电话" width="110"></el-table-column>
        <el-table-column prop="addr" label="地址" width="50" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="businessTimeFrom" label="营业时间起" width="60" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="businessTimeTo" label="营业时间止" width="60" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="businessImgs" label="营业资质图片" width="50" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="state" label="使用状态" width="50"></el-table-column>
        <el-table-column prop="rest" label="休息情况" width="50"></el-table-column>
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
      this.jump("/main/sellerCreate");
    },
    update(row) {
      var seller = {
        _id: row._id,
        storeName: row.storeName,
        mainImg: row.mainImg,
        distance: row.distance,
        sendTime: row.sendTime,
        saleNum: row.saleNum,
        distribute1: row.distribute1,
        distribute2: row.distribute2,
        storeImgs: row.storeImgs,
        phone: row.phone,
        addr: row.addr,
        businessTimeFrom: row.businessTimeFrom,
        businessTimeTo: row.businessTimeTo,
        businessImgs: row.businessImgs,
        state: row.state,
        rest: row.rest
      }
      localStorage.setItem('seller',JSON.stringify(seller));
      this.jump("/main/sellerCreate");

    },
    deletes(id) {
      var self = this;
      self.request("api/seller/delete",{
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
      console.log(row.photo);
      console.log(column.label);
      console.log(cell);
      console.log(event);
      if(column.label == "主图") {
        var img = self.const().IP + row.mainImg;
        self.$alert('<div style="text-align:center;"><img style="border:1px solid #eee;" src="' + img + '"/></div>', '图片效果', {
          dangerouslyUseHTMLString: true
        });
      } else if(column.label == "店铺图片") {
        var str ='<div style="text-align:center;display:flex;flex-direction:row;">';
        for(var i = 0; i < row.storeImgs.length; i++) {
          str += '<img style="border:1px solid #eee;" src="' + self.const().IP + row.storeImgs[i] + '"/>'
        }
        str += '</div>'
        self.$alert(str, '图片效果', {
          dangerouslyUseHTMLString: true
        });
      } else if(column.label == "营业资质图片"  ) {
        var str ='<div style="text-align:center;display:flex;flex-direction:row;">';
        for(var i = 0; i < row.businessImgs.length; i++) {
          str += '<img style="border:1px solid #eee;" src="' + self.const().IP + row.businessImgs[i] + '"/>'
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
      self.request("api/seller/find",{
        "method":"POST",
        "data": obj,
        "success": function(res){
          if(res.data.success) {
            self.dataList = res.data.data;
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