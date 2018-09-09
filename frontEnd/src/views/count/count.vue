<template>
  <div>
    <el-row :gutter="20" class="mt20b20">
      <el-col :span="4">
        <el-input placeholder="订单时间起" prefix-icon="el-icon-search" v-model="createdFrom"></el-input>
      </el-col>
      <el-col :span="4">
        <el-input placeholder="订单时间止" prefix-icon="el-icon-search" v-model="createdTo"></el-input>
      </el-col>
      <el-col :span="4">
        <el-input placeholder="要求送达时间起" prefix-icon="el-icon-search" v-model="sendTimeFrom"></el-input>
      </el-col>
      <el-col :span="4">
        <el-input placeholder="要求送达时间止" prefix-icon="el-icon-search" v-model="sendTimeTo"></el-input> 
      </el-col>
      <el-col :span="4">
        <el-input placeholder="地址" prefix-icon="el-icon-search" v-model="addr"></el-input>
      </el-col>
      <el-col :span="4">
        <el-input placeholder="详细地址" prefix-icon="el-icon-search" v-model="detailAddr"></el-input> 
      </el-col>
    </el-row>

    <el-row class="mt20b20">
      <el-button type="warning" @click="search">搜索</el-button>
    </el-row>

    <div style="width:1200px;margin:auto;">
      <el-table :data="goodsArr" border style="width: 100%" header-cell-style="text-align:center;">
        <el-table-column prop="goodsId" label="商品id" width="350"></el-table-column>
        <el-table-column prop="name" label="商品名称" width="250"></el-table-column>
        <el-table-column prop="priceNum" label="价格 * 数量 = 金额" width="250">
          <template slot-scope="scope">
            <div v-for="priceNum in scope.row.priceNum">
              {{priceNum.price}} <span class="cred"> X </span> {{priceNum.num}} <span class="cred"> = </span> {{priceNum.price * priceNum.num}}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="totalMoney" label="商品总金额" width="210"></el-table-column>
      </el-table>
    </div>
    <div style="margin: 20px 0;">
      <span>总数量： </span> <span style="font-size:30px;color:red;margin-right:20px;">{{totalNum}}</span>
      <span>总金额：</span> <span style="font-size:30px;color:red;">{{totalMoney}}</span>
    </div>

    <div style="width:1200px;margin:auto;">
      <el-table :data="dataList" border style="width: 100%" header-cell-style="text-align:center;" @cell-click="showAddrGoods">
        <el-table-column prop="_id" label="_id" width="50" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="addrId" label="地址id" width="50" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="sendTime" label="要求时间" width="60"></el-table-column>
        <el-table-column prop="payType" label="支付方式" width="50" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="goods" label="订购详情" width="270" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <div v-for="goods in scope.row.goods">
              {{goods.goodsId}} <span class="cred">X</span> {{goods.num}} <span class="cred">X</span> {{goods.price}}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="explain" label="备注说明" width="170" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="openid" label="openid" width="50" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="state" label="状态" width="70"></el-table-column>
        <el-table-column prop="arriveTime" label="送达时间" width="60"></el-table-column>
        <el-table-column prop="evaluate" label="评价" width="50"></el-table-column>
        <el-table-column prop="print" label="打印" width="50"></el-table-column>
        <el-table-column prop="printNum" label="打印数" width="50"></el-table-column>
        <el-table-column prop="delId" label="删除标记" width="50"></el-table-column>
        <el-table-column prop="totalMoney" label="金额" width="60"></el-table-column>
        <el-table-column prop="created" label="下单时间" width="50" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="updated" label="修改时间" width="50" :show-overflow-tooltip="true"></el-table-column>
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
      createdFrom: "",
      createdTo: "",
      sendTimeFrom: "",
      sendTimeTo: "",
      addr: "",
      detailAddr: "",
      currentPage: 1,
      pageSize: 10,
      totalSize: 0,

      goodsList: [],
      goodsArr: [],
      totalNum: 0,
      totalMoney: 0
    }
  },
  created:function() {
    var self = this;
    self.request("api/goods/findAll",{
      "method":"POST",
      "data": {},
      "success": function(res){
        if(res.data.success) {
          self.goodsList = res.data.data;
          console.log("self.goodsList data");
          console.log(res.data.data);
          self.dataChange();
        }
      }
    });
  },
  methods:{
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
        createdFrom: self.createdFrom,
        createdTo: self.createdTo,
        sendTimeFrom: self.sendTimeFrom,
        sendTimeTo: self.sendTimeTo,
        addr: self.addr,
        detailAddr: self.detailAddr,
        pageSize: self.pageSize,
        currentPage: self.currentPage
      };
      self.request("api/count/find",{
        "method":"POST",
        "data": obj,
        "success": function(res){
          if(res.data.success) {
            console.log("count find");
            console.log(JSON.stringify(res.data.data));
            console.log("count find goodsArr");
            console.log(JSON.stringify(res.data.goodsArr));
            var data = res.data.data;
            for (var i = 0; i < data.length; i++) {
              data[i].created = self.format(new Date(data[i].created), "yyyy-MM-dd hh:mm:ss");
              data[i].updated = self.format(new Date(data[i].updated), "yyyy-MM-dd hh:mm:ss");
            }
            self.dataList = data;
            self.totalSize = res.data.total;
            var goodsList = self.goodsList,
              goodsArr = res.data.goodsArr;
            for(var i = 0; i < goodsArr.length; i++) {
              for(var j = 0; j < goodsList.length; j++) {
                if(goodsArr[i]["goodsId"] == goodsList[j]["_id"]) {
                   goodsArr[i]["name"] = goodsList[j]["name"]
                }
              }
            }
            self.goodsArr = goodsArr;
            self.totalNum = res.data.totalNum;
            self.totalMoney = res.data.totalMoney;
          } else {
            self.$message(res.data.data);
          }
        }
      });
    },
    showAddrGoods: function(row, column, cell, event) {
      var self = this;
      if(column.label == "地址id") {
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