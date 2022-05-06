<template>
<div>
    <head-top :goBack="true" :userinfo="true" :title="'确认订单'">123</head-top>
    <section class="address">
      <svg class="location_icon">
        <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#location"></use>
      </svg>
      <div class="add_address" v-if="!choosedAddress" @click="bottomPopup=true">请添加一个收货地址</div>
      <div class="address_show" v-else >
        <div style="width:82%">
          <div class="address_item">
            <span>{{chosenIndex!=undefined && addrlist.length>0&& addrlist[chosenIndex].name || undefined}}</span>
            <span>{{chosenIndex!=undefined && addrlist.length>0&& addrlist[chosenIndex].tel || undefined}}</span>
          </div>
          <div class="address_item">
            {{chosenIndex!=undefined && addrlist.length>0 && addrlist[chosenIndex].address || undefined}}
          </div>
        </div>
        <van-icon name="edit" style="margin-top: 1rem" @click="bottomPopup=true"/>
      </div>
    </section>
    <section class="goods_list">
      <el-table
        :data="shopCart"
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
    </section>
    <footer>
      <span class="fs1">合计：￥{{$route.query.totalPrice}}元</span>
      <el-button type="primary" round @click="pay">去支付</el-button>
    </footer>
    <van-popup v-model="bottomPopup" position="bottom" :style="{ height: '60%',overflow: 'scroll' }" >
      <van-address-list
        v-model="chosenAddressId"
        :list="addrlist"
        default-tag-text="默认"
        @add="onAdd"
        @edit="onEdit"
        @select="onSelect"
      >
      <template #default>
      </template>
      </van-address-list>
    </van-popup>
    <van-dialog 
    v-model="dialogAlert" 
    confirmButtonText="已完成支付" 
    cancelButtonText="取消支付" 
    :showCancelButton="true" 
    @confirm= "dialogConfirm"
    @close= "dialogClose"
    :closeOnPopstate="false">
    </van-dialog>
</div>
</template>

<script>
import axios from 'axios'
import headTop from '../components/head.vue'
import { Popup, AddressList, Icon, Toast } from 'vant';
import { mapState,mapActions } from 'vuex'
import dayjs from 'dayjs'
export default {
  components:{
    [Popup.name]: Popup,
    [Icon.name]: Icon,
    [AddressList.name]: AddressList,
    headTop
  },
  data () {
    return {
      shopCart: null,
      choosedAddress: true,
      bottomPopup: false,
      chosenAddressId: null,
      chosenIndex: null,
      addrlist:[],
      dialogAlert: null,
      outTradeNo: null
    }
  },
  methods: {
    ...mapActions(['setPayState']),
    onAdd(){
      this.$router.push({path: '/addressEdit', query:{
        type: 'insert'
      }})
    },
    onEdit(content){
      this.$router.push({path: '/addressEdit',query:{
        type: 'update',
        aid: content.id,
        addressDetail: content.address,
        name: content.name,
        tel: content.tel
      }})
    },
    onSelect(content, index){
      this.chosenIndex = index
    },
    getAddr(){
      axios.get(`/private/getAddr?uid=${this.userInfo.uid}`).then(res => {
        if (res.data.status === 0) {
          let data = res.data.data;
          data.forEach((item,index) => {
            if(item.isDefault === 1) {
              this.chosenAddressId = item.aid
              this.chosenIndex = index
            }
            this.addrlist.push({
              type: 'update',
              id: item.aid,
              name: item.name,
              tel: item.phone,
              address: item.detailaddr,
              isDefault: item.isDefault 
            })
          })
          // 如果没有选中的地址，则需要选中地址
          if(!this.chosenAddressId){
            this.choosedAddress = true
          }
        }
      })
    },
    pay() {
      if(this.chosenIndex !== undefined && this.chosenIndex !== null) {
        console.log(this.chosenIndex);
        axios.post(`/private/pay`,{
          goodslist: JSON.stringify(this.shopCart),
          totalAmount: this.$route.query.totalPrice
        }).then(res=>{
          if(res.data.status === 0) {
            let _data = res.data.data
            window.open(_data.url, 'pay')
            this.outTradeNo = _data.outTradeNo
            this.dialogAlert = true
            this.setPayState(1)
          }  
        })
      }
      else {
        Toast('未选择地址')
      }
    },
    dialogConfirm(){
      // this.setPayState(0)
      // axios.post(`/private/queryOrder`,{
      //   outTradeNo: String(this.outTradeNo)
      // }).then(res => {
      //   if(res.data.status === 0){
      //     axios.get(res.data.data.url).then(res => {
      //       if(res.status === 200 && res.data.alipay_trade_query_response.trade_status === 'TRADE_SUCCESS') {
      //         // 生成订单
      //         this.insertOrder()
      //       }
      //       else{
      //         Toast({message:"支付失败"})
      //       }
      //     })
      //   }
      // })
    },
    dialogClose(){
      this.setPayState(0)
      axios.post(`/private/queryOrder`,{
        outTradeNo: String(this.outTradeNo)
      }).then(res => {
        if(res.data.status === 0){
          axios.get(res.data.data.url).then(res => {
            if(res.status === 200 && res.data.alipay_trade_query_response.trade_status === 'TRADE_SUCCESS') {
              // 生成订单
              this.insertOrder()
              this.transfer(res.data.alipay_trade_query_response.total_amount)
            }
            else{
              Toast({message:"支付失败"})
            }
          })
        }
      })
    },
    insertOrder(){
      let buyerInfo = {name: this.addrlist[this.chosenIndex].name, phone:this.addrlist[this.chosenIndex].phone, address: this.addrlist[this.chosenIndex].address}
      axios.post(`/private/insertOrder`,{
        serve_id: this.$route.query.serve_id,
        uid: this.userInfo.uid,
        ocontent: JSON.stringify(this.shopCart),
        otime: dayjs(new Date()).locale('zh-cn').format('YYYY-MM-DD hh:mm:ss'),
        ostatus: 2,
        type: this.shopInfo.serve_type,
        address: buyerInfo,
        seller_status: 1
      }).then(res => {
        if(res.data.status === 0){
          Toast({message: '购买成功'})
        }
      })
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
  created(){
    this.dialogAlert = Boolean(this.payState)
  },
  activated() {
    // 从商店进入订单页面所做的初始化
    this.shopCart = JSON.parse(this.$route.query.shopCart)

    // 从编辑地址进入订单页面所做的初始化
    this.chosenIndex = null
    this.addrlist = []
    this.getAddr()
  },
  deactivated() {
    
  },
  computed:{
    ...mapState(['userInfo', 'payState'])
  },
  watch: {
    chosenIndex(value){
    }
  }
}
</script>

<style scoped>
.address_item{
  height: 1rem;
  font-size: .60rem;
}
.add_address{
  float: right;
  width: 90%;
  height: 2.4rem;
  line-height: 2.4rem;
}
.address_show{
  display: flex;
  float: right;
  width: 90%;
  height: 2rem;
  line-height: 2rem;
}
.address{
    position: relative;
    width: 100%;
    height: 3rem;
    padding-left: .4rem;
    margin-top: 2rem;
    line-height: 3rem;
    border-bottom: .0225rem solid rgb(231, 228, 228, .8);
}
.location_icon{
  position: absolute;
  top: 1rem;
  display: inline-block;
  width: .8rem;
  height: .6rem;
  fill: blue;
}
.goods_list{
  width: 100%;
  height: 20.3rem;
  overflow: scroll;
}
footer{
    position: fixed;
    display: flex;
    justify-content: space-around;
    align-items: center;
    width: 100%;
    bottom: 0;
    height: 3rem;
    border-top: 1px solid rgb(231, 220, 220, .9);
}
.fs1{
  font-size: .9rem;
  color: black;
  font-weight: 800;
}
</style>
