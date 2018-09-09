<template>
  <div>
    <div class="form">
      <p class="title">{{form._id? "修改": "新增"}}订单</p>
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="送货地址id">
          <el-input v-model="form.addrId" placeholder="addrId"></el-input>
        </el-form-item>
        <el-form-item label="要求时间">
          <el-input v-model="form.sendTime" placeholder="sendTime"></el-input>
        </el-form-item>
        <el-form-item label="支付方式">
          <el-input v-model="form.payType" placeholder="payType"></el-input>
        </el-form-item>
        <el-form-item label="订购详情">
          <el-input v-model="goodsId" placeholder="goodsId"></el-input>
          <el-input v-model="num" placeholder="num"></el-input>
          <el-input v-model="price" placeholder="price"></el-input>
          <div v-for="(goods, index) in form.goods" v-show="form.goods.length > 0">
            {{goods.goodsId}} X {{goods.num}} X {{goods.price}} <span class="del" @click="del(index)">X</span>
          </div>
          <el-button @click="createGoods" type="success" size="small">新增订购</el-button>
        </el-form-item>
        <el-form-item label="说明">
          <el-input v-model="form.explain" placeholder="explain"></el-input>
        </el-form-item>
        <el-form-item label="openid">
          <el-input v-model="form.openid" placeholder="openid"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-input v-model="form.state" placeholder="state"></el-input>
        </el-form-item>
        <el-form-item label="送达时间">
          <el-input v-model="form.arriveTime" placeholder="arriveTime"></el-input>
        </el-form-item>
        <el-form-item label="是否已评价">
          <el-input v-model="form.evaluate" placeholder="evaluate"></el-input>
        </el-form-item>
        <el-form-item label="是否已打印">
          <el-input v-model="form.print" placeholder="print"></el-input>
        </el-form-item>
        <el-form-item label="打印数">
          <el-input v-model="form.printNum" placeholder="printNum"></el-input>
        </el-form-item>
        <el-form-item label="delId">
          <el-input v-model="form.delId" placeholder="delId"></el-input>
        </el-form-item>
        <el-form-item label="totalMoney">
          <el-input v-model="form.totalMoney" placeholder="totalMoney"></el-input>
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
.del{width:20px;height:20px;line-height: 20px;text-align: center;display: inline-block;border:1px solid red;border-radius: 50%;}
</style>
<script>
export default {
  name: 'login',
  data () {
    return{
      form: {
        addrId: "",
        sendTime: "",
        payType: "",
        goods: [],
        explain: "",
        state: "",
        arriveTime: "",
        openid: "",
        evaluate: "",
        print: "",
        printNum: "",
        delId: 0,
        totalMoney: 0
      },
      goodsId: "",
      num: "",
      price: ""
    }
  },
  created: function() {
    var self = this;
    var order = localStorage.getItem('order');
    if(order && !self.isEmptyObject(order)) {
      this.form = JSON.parse(order);
      localStorage.removeItem('order');
    }
  },
  methods:{
    submit: function() {
      var self = this;
      self.request("api/order/createAndUpdate",{
        "method":"POST",
        "data": self.form,
        "success": function(res){
          self.jump("/main/order");
        }
      });
    },
    createGoods: function() {
      var self = this;
      if(!self.goodsId || !self.num || !self.price) {
        self.$message('goodsId和num和price不能为空');
        return 
      } else {
        var obj = {
          goodsId: self.goodsId,
          num: self.num,
          price: self.price
        };
        self.form.goods.push(obj);
        self.goodsId = "";
        self.num = "";
        self.price = "";
      }
    },
    del: function(index) {
      var self = this;
      console.log(index);
      self.form.goods.splice(index, 1);
    }
  }
}
</script>