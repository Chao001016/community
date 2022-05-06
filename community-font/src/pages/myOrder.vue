<template>
    <div>
        <head-top :goBack="true" :userinfo="true" :title="'我的订单'" ></head-top>
        <div style="margin-top: 2rem;height:24rem;overflow:scroll" @scroll="getOrderByPage">
            <van-empty description="暂无数据" v-if="!order||order.length<=0">
            </van-empty>
            <section v-for="item in order" :key="item.oid" class="order_list">
                <div class="head" style="padding-left:.3rem"><span>订单编号:{{item.oid}}</span><span>订单时间:{{item.otime}}</span>
                <span>订单状态:{{item.pay_amount?"已支付"+item.pay_amount+'元':item.orderStatus}}</span><span>服务类型:{{item.serveName}}</span></div>
                <el-table
                    v-if="item.type==1||item.type==4"
                    :data="item.ocontent"
                    style="width: 100%">
                    <el-table-column
                        prop="name"
                        label="商品名称"
                        width="120">
                    </el-table-column>
                    <el-table-column
                        prop="price"
                        label="商品价格(￥)"
                        width="120">
                    </el-table-column>
                    <el-table-column
                        prop="num"
                        label="商品数量"
                        width="120">
                    </el-table-column>
                </el-table>
                <!-- <van-field
                v-if="item.type==2"
                v-model="item.ocontent"
                name="shopName"
                label="订单内容"
                placeholder="修理件数及内容"
                label-width="4.5rem"
                autocomplete="off" 
                type="textarea"
                rows="1"
                :disabled="true"
                :rules="[{ required: true }]"
                /> -->
                <div style="font-size:.55rem;margin-left:.7rem" v-if="item.type!=1&&item.type!=4">订单内容:  {{item.ocontent}}</div>
                <div style="font-size:.55rem;margin-left:.7rem">商家状态:  {{item.sellerStateName}}</div>
                <el-button @click="priceDialog=true;oid=item.oid " v-if="item.ostatus==1" style="margin:.2rem .6rem" type="primary" size="mini">去支付</el-button>
                <el-button @click="goComment(item.serve_id, item.type)" v-if="item.ostatus==2" style="margin-left:.6rem">去评价</el-button>
                <div style="display:inline-block" v-if="item.ostatus==2">
                    <el-rate v-model="item.star" @change="updateStar(item.oid, $event)"></el-rate>
                </div>
            </section>
            <van-dialog v-model="priceDialog" title="支付金额" show-cancel-button @confirm="payConfirm()">
                <van-field
                v-model="price"
                placeholder="支付金额"
                type="number"
               
                />    
            </van-dialog>

             <van-dialog 
            v-model="queryDialog" 
            confirmButtonText="已完成支付" 
            cancelButtonText="取消支付" 
            :showCancelButton="true" 
            @confirm="queryConfirm()"
            @close="queryClose()"
            :closeOnPopstate="false">
             </van-dialog>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import headTop from '../components/head.vue'
import { mapState } from 'vuex'
import { Toast } from 'vant'
var that = {}
export default {
  components:{
      headTop
  },
  data () {
    return {
        oid: null,
        queryDialog: false,
        priceDialog: false,
        order:[],
        star: null,
        page: 1,
        size: 10,
        totalPage: null,
        price: null,
    }
  },
  computed: {
      ...mapState(['userInfo'])
  },
  methods: {
      goComment(id, type){
            if(type==2||type==3||type==4||type==5||type==6||type==7||type==8) {
                this.$router.push({path: "/serviceDetail", query: { comment: true, id: id }})
            }
            else if(type==1||type==9) {
                this.$router.push({path: "/shopDetail", query: { comment: true, id: id }})
            }
      },
      updateStar(oid, star){
          console.log(...arguments);
          axios.post(`/private/updateStar`,{
              oid: oid,
              star
          })
      },
      async getOrder() {
        await axios.get(`/private/getOrder?uid=${this.userInfo.uid}&size=${this.size}&page=${this.page}`).then(res => {
          if(res.data.status === 0) {
              let _data = res.data.data
              _data.data.forEach(item => {
                if(item.type==1) item.ocontent = JSON.parse(item.ocontent)
                if(item.ostatus==1) item.orderStatus = '未支付'
                else item.orderStatus = '已支付'
                switch (String(item.type)) {
                    case '1':
                        item.serveName =  '售卖(衣服、食品)'
                        break;
                    case '2':
                        console.log(12121);
                        item.serveName =  '修理'
                        break;
                    case '3':
                        item.serveName =  '清洁'  
                    break;  
                    case '4':
                        item.serveName =  '二手交易'
                        break;
                    case '5':
                        item.serveName =  '车位出租' 
                        break;
                    case '6':
                        item.serveName =  '装修' 
                        break;
                    case '7':
                        item.serveName =  '房屋出租' 
                        break;
                    case '8':
                        item.serveName =  '搬家' 
                        break;
                    case '9':
                        item.serveName =  '艺术培训'
                        break; 
                    default:
                }
                switch(String(item.seller_status)){
                    case '1':
                        item.sellerStateName = '未确认订单'
                        break;
                    case '2':
                        item.sellerStateName = '收到订单'
                        break;
                    case '3':
                        item.sellerStateName = '已发货'
                        break;
                    case '4':
                        item.sellerStateName = '正在服务途中'
                        break;
                    case '5':
                        item.sellerStateName = '订单结束'
                        break;
                    default:
                        break
                }
                this.order.push(item)
              })
              this.page++
              this.totalPage = _data.totalPage
          }
         })
      },
      pay(){
           axios.post(`/private/pay`,{
                goodslist: JSON.stringify(this.ocontent),
                totalAmount: this.price
            }).then(res=>{
                if(res.data.status === 0) {
                    let _data = res.data.data
                    window.open(_data.url, 'pay')
                    this.outTradeNo = _data.outTradeNo
                    this.queryDialog = true
                }  
            })
      },
      getOrderByPage(e) {
        if(e.target.scrollHeight - 20 < e.target.scrollTop + e.target.clientHeight) {
            if(this.page <= this.totalPage) {
                that._getOrder()
            }
        }
      },
      payConfirm(){
          this.pay()
      },
      queryConfirm(){
        axios.post(`/private/queryOrder`,{
            outTradeNo: String(this.outTradeNo)
        }).then(res => {
            if(res.data.status === 0){
            axios.get(res.data.data.url).then(res => {
                if(res.status === 200 && res.data.alipay_trade_query_response.trade_status === 'TRADE_SUCCESS') {
                // 生成订单
                this.transfer(res.data.alipay_trade_query_response.total_amount)
                this.updateOrder()
                Toast({message:"支付成功"})
                }
                else{
                Toast({message:"支付失败"})
                }
            })
            }
        })
      },
      queryClose(){
        axios.post(`/private/queryOrder`,{
            outTradeNo: String(this.outTradeNo)
        }).then(res => {
            if(res.data.status === 0){
            axios.get(res.data.data.url).then(res => {
                if(res.status === 200 && res.data.alipay_trade_query_response.trade_status === 'TRADE_SUCCESS') {
                // 生成订单
                this.updateOrder()
                Toast({message:"支付成功"})
                }
                else{
                Toast({message:"支付失败"})
                }
            })
            }
        })
      },
      updateOrder(){
          axios.post(`/private/updateOrder`,{
              oid: this.oid,
              ostatus: 2
          }).then(res => {
              if(res.data.status === 0){
                  this.order.forEach(item=>{
                      if(item.oid == this.oid) {
                          item.ostatus=2
                          item.orderStatus = '已支付'
                      }
                  })
              }
          })
      },
      chooseShopPage(id, shop_pic, type){
        if(type==2||type==3||type==4||type==5||type==6||type==7||type==8) {
            console.log(`{path: "/serviceDetail", query: { id: ${id}, shop_pic: ${shop_pic }}}`);
            return {path: "/serviceDetail", query: { id: id, shop_pic: shop_pic }}
        }
        else if(type==1||type==9) {
            return {path: "/shopDetail", query: { id: id, shop_pic: shop_pic }}
        }
      },
      transfer(payAmount){
        axios.post(`/private/transfer`,{
            identity: this.userInfo.payIdentity,
            pay_amount: payAmount
        }).then(res => {
            if(res.data.status === 0){

            }
        })
      }
  },
  deactivated(){
    this.$destroy()
  },
  mounted(){
      this.getOrder()
  },
  created(){
      that._getOrder = this._.throttle(this.getOrder, 900, {leading: false})
  }
}
</script>

<style scoped>
.order_list{
    margin-top: 1rem;
    border-bottom: 1px solid rgb(220, 208, 208, .8);
}
.head span{
    display: flex;
    padding-left: .4rem;
    font-size: .55rem;
}
</style>
