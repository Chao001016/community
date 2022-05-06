<template>
    <div>
        <head-top :goBack="true" :userinfo="true" :title="'商家订单'" ></head-top>
        <div style="margin-top: 2rem;height:24rem;overflow:scroll" @scroll="getSellerOrderByPage">
            <van-empty description="暂无数据" v-if="!order||order.length<=0">
            </van-empty>
            <section v-for="item in order" :key="item.oid" class="order_list">
                <div class="head"><span>订单编号:  {{item.oid}}</span><span>订单时间:  {{item.otime}}</span>
                <span>订单状态:{{"已支付"+item.payAmount+'元'||item.orderStatus}}</span><span>服务类型:  {{item.serveName}}</span>
                <span>买家姓名:  {{item.buyerName}}</span><span>买家电话:  {{item.buyerPhone}}</span>
                <span>买家地址:  {{item.buyerAddress }}</span>
                </div>
                <el-table v-if="item.type==1||item.type==4"
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
                <div v-if="item.type!=1" style="font-size:.55rem;margin-left:.4rem">订单内容:  {{item.ocontent}}</div>
                <!-- <el-button type="primary" size="mini"  @click="changeSellerState(item.oid, item.seller_state)">收到订单</el-button> -->
                <van-popover v-model="item.statePop" :actions="stateAction" @select="onStateSelect($event,item.oid)" placement="top">
                    <template #reference>
                    <el-button type="primary" size="mini" @click="item.statePop=!item.statePop" style="margin-left:.4rem;margin-top:.2rem">{{item.sellerStateName}}</el-button>
                    </template>
                </van-popover>
            </section>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import headTop from '../components/head.vue'
import { mapState } from 'vuex'
var that = {}
export default {
  components:{
      headTop
  },
  data () {
    return {
        stateAction:[{text:'未确认订单',value:1},{text:'收到订单',value:2},{text:'已发货',value:3},{text:'正在服务途中',value:4},{text:'订单结束',value:5}],
        statePop:false,
        order:[],
        page: 1,
        size: 5,
        totalPage: null,
    }
  },
  methods: {
    async getSellerOrder(){
        await axios.get(`/private/getSellerOrder?uid=${this.userInfo.uid}`).then(res => {
            if(res.data.status === 0) {
                let _data = res.data.data
                _data.data.forEach(item => {
                    // 售卖服务的订单内容为JSON数据格式
                    if(item.type==1||item.type==4){
                        item.ocontent = JSON.parse(item.ocontent)
                    }
                    // 支付状态
                    if(item.ostatus==1) item.orderStatus = '未支付'
                    else item.orderStatus = '已支付'
                    // 订单类型转为中文
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
                    // 商家状态
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
                            item.sellerStateName = '未确认订单'
                            break
                    }
                    // PopOver
                    item.statePop = false
                    // 买家信息
                    let buyerInfo = JSON.parse(item.buyer_info)
                    console.log(buyerInfo);
                    item.buyerName = buyerInfo.name
                    item.buyerPhone = buyerInfo.phone
                    item.buyerAddress = buyerInfo.address
                    this.order.push(item)
                })
                this.page++
                this.totalPage = _data.totalPage
            }
        })
    },
    getSellerOrderByPage(e){
        if(e.target.scrollHeight - 20 < e.target.scrollTop + e.target.clientHeight) {
            if(this.page <= this.totalPage) {
                that._getSellerOrder()
            }
        }
    },
    changeSellerState(oid, sellerStatus){
        // null 下一个状态为 收到订单 1
        // 1 收到订单的下一个状态为 正在服务路上
        if(sellerStatus===null||sellerStatus===undefined)sellerStatus=0
        axios.post(`/private/changeSellerState`,{
            oid,
            seller_status: sellerStatus + 1
        }).then(res => {
            if(res.data.status === 0) {
               
            }
        })
    },
    onStateSelect(item, oid){
        this.changeSellerState(oid, item.value)
        this.order.forEach(i=>{
            if(i.oid === oid){
                console.log(i);
                i.sellerStateName = item.text
            }
        })
    }
  },
  computed:{
    ...mapState(['userInfo'])
  },
  deactivated(){
    this.$destroy()
  },
  created(){
    that._getSellerOrder = this._.throttle(this.getSellerOrder, 900, {leading: false})
    this.getSellerOrder()
  }
}
</script>

<style scoped>
.order_list{
    padding: .4rem 0;
    border-bottom: 1px solid rgb(220, 208, 208, .8);
}
.head span{
    display: flex;
    padding-left: .4rem;
    font-size: .55rem;
}
</style>
