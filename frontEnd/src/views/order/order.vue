<template>
  <div>
    <el-row :gutter="20" class="mt20b20">
      <el-col :span="4">
        <el-input placeholder="送货地址id" prefix-icon="el-icon-search" v-model="addrId"></el-input>
      </el-col>
      <el-col :span="5">
        <el-input placeholder="要求时间" prefix-icon="el-icon-search" v-model="sendTime"></el-input>
      </el-col>
      <el-col :span="5">
        <el-input placeholder="状态" prefix-icon="el-icon-search" v-model="state"></el-input>
      </el-col>
      <el-col :span="5">
        <el-input placeholder="送达时间" prefix-icon="el-icon-search" v-model="arriveTime"></el-input> 
      </el-col>
      <el-col :span="5">
        <el-input placeholder="openid" prefix-icon="el-icon-search" v-model="openid"></el-input> 
      </el-col>
    </el-row>

    <el-row class="mt20b20">
      <el-button type="primary" @click="create">新增</el-button>
      <el-button type="warning" @click="search">搜索</el-button>
    </el-row>

    <div style="width:1200px;margin:auto;">
      <el-table :data="dataList" border style="width: 100%" header-cell-style="text-align:center;" @cell-click="showAddrGoods">
        <el-table-column prop="_id" label="_id" width="50" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="addrId" label="送货地址id" width="150"></el-table-column>
        <el-table-column prop="sendTime" label="要求时间" width="100"></el-table-column>
        <el-table-column prop="payType" label="支付方式" width="80"></el-table-column>
        <el-table-column prop="goods" label="订购详情" width="150">
          <template slot-scope="scope">
            <div v-for="goods in scope.row.goods">
              {{goods.goodsId}} <span class="cred">X</span> {{goods.num}} <span class="cred">X</span> {{goods.price}}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="explain" label="备注说明" width="110"></el-table-column>
        <el-table-column prop="openid" label="openid" width="150"></el-table-column>
        <el-table-column prop="state" label="状态" width="70"></el-table-column>
        <el-table-column prop="arriveTime" label="送达时间" width="100"></el-table-column>
        <el-table-column prop="evaluate" label="评价" width="50"></el-table-column>
        <el-table-column prop="print" label="打印" width="50"></el-table-column>
        <el-table-column prop="printNum" label="打印数" width="50"></el-table-column>
        <el-table-column prop="delId" label="delId" width="50"></el-table-column>
        <el-table-column prop="totalMoney" label="totalMoney" width="50"></el-table-column>
        <el-table-column prop="created" label="created" width="50" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="updated" label="updated" width="50" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="操作" width="230">
          <template slot-scope="scope">
            <el-button type="primary" size="small" @click="printOrder(scope.row._id)">打印</el-button>
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
.cred{color: red;}
.mt20{margin-top: 20px;}
</style>
<script>
export default {
  data () {
    return{
      dataList: [],
      addrId: "",
      sendTime: "",
      state: "",
      arriveTime: "",
      openid: "",
      evaluate: "",
      print: "",
      printNum: "",

      currentPage: 1,
      pageSize: 10,
      totalSize: 0,

      goodsList: []
    }
  },
  created:function() {
    var self = this;
    self.dataChange();
    self.request("api/goods/findAll",{
      "method":"POST",
      "data": {},
      "success": function(res){
        if(res.data.success) {
          self.goodsList = res.data.data;
          console.log("self.goodsList data");
          console.log(res.data.data);
        }
      }
    });
  },
  methods:{
    create: function() {
      this.jump("/main/orderCreate");
    },
    update(row) {
      var order = {
        _id: row._id,
        addrId: row.addrId,
        sendTime: row.sendTime,
        payType: row.payType,
        goods: row.goods,
        explain: row.explain,
        state: row.state,
        arriveTime: row.arriveTime,
        openid: row.openid,
        evaluate: row.evaluate,
        print: row.print,
        printNum: row.printNum,
        delId: row.delId,
        totalMoney: row.totalMoney
      }
      localStorage.setItem('order',JSON.stringify(order));
      this.jump("/main/orderCreate");

    },
    deletes(id) {
      var self = this;
      self.request("api/order/delete",{
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
          }
          self.$message(res.data.data);
        }
      });
    },
    printOrder(id) {
      var self = this;
      self.request("api/order/print",{
        "method":"POST",
        "data": {_id: id},
        "success": function(res){
          if(res.data.success) {
            for(var i = 0; i < self.dataList.length; i++) {
              if(self.dataList[i]._id == id) {
                self.dataList[i].print = 1;
                self.dataList[i].printNum += 1;
              }
            }
          }
          self.$message(res.data.data);
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
        addrId: self.addrId,
        sendTime: self.sendTime,
        state: self.state,
        arriveTime: self.arriveTime,
        openid: self.openid,
        evaluate: self.evaluate,
        print: self.print,
        printNum: self.printNum,
        pageSize: self.pageSize,
        currentPage: self.currentPage
      };
      self.request("api/order/find",{
        "method":"POST",
        "data": obj,
        "success": function(res){
          if(res.data.success) {
            var data = res.data.data;
            for (var i = 0; i < data.length; i++) {
              data[i].arriveTime = self.format(new Date(data[i].arriveTime), "yyyy-MM-dd hh:mm:ss");
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
    },
    showAddrGoods: function(row, column, cell, event) {
      var self = this;
      if(column.label == "送货地址id") {
        self.request("api/address/find",{
          "method":"POST",
          "data": {_id: row.addrId},
          "success": function(res){
            if(res.data.success) {
              var data = res.data.data[0];
              console.log("送货地址id data");
              console.log(data);
              var code = '<div>';
              for(var key in data) {
                code += '<div><span style="display:inline-block;width:100px;text-align:right;padding-right:20px;">' + key +': </span>' + data[key] + '</div>'
              }
              code += '</div>'
              self.$alert(code, '地址详情', {
                dangerouslyUseHTMLString: true
              });
            } else {
              self.$message(res.data.data);
            }
          }
        });
      } else if(column.label == "订购详情") {
        console.log(row.goods);
        var goods = row.goods,
            goodsList = self.goodsList,
            code = '<div>';
        console.log(self.goodsList);
        for(var i = 0; i < goods.length; i++) {
          for(var j = 0; j < goodsList.length; j++) {
            if(goods[i]["goodsId"] == goodsList[j]["_id"]) {
              code += '<div><span style="display:inline-block;width:100px;text-align:right;padding-right:20px;">' + goodsList[j]["name"] +': </span>' + goods[i]["num"] + '</div>'
            }
          }
        }
        code += '</div>'
        self.$alert(code, '订购详情', {
          dangerouslyUseHTMLString: true
        });
      }
    }
  }
}
</script>