<template>
  <div>
      <head-top :goBack="true" :userinfo="true" :title="'我提供的服务'"></head-top>
      <nav class="common_nav">
          <div :class="{item_status:true,active:showType==='on'}" @click="toOn">营业中</div>
          <div :class="{item_status:true,active:showType==='down'}" @click="toDown">休业中</div>
          <div :class="{item_status:true,active:showType==='audit'}" @click="toAudit">审核中</div>
          <div :class="{item_status:true,active:showType==='fail'}" style="width:4rem" @click="toFail">审核不通过</div>
      </nav>
      <div v-show="showType==='on'" class="shop_list_container" @scroll="getShopMenuByPage($event, 1)">
          <van-empty description="暂无数据" v-if="!on||on.length<=0">
          </van-empty>
          <section v-for="item in on" :key="item.serve_id" class="shoplist" v-else>
              <img src="@/assets/shopcart.png" alt="" v-show="!item.shop_pic">
              <img :src="item.shop_pic" alt="" v-show="item.shop_pic">
              <div class="details">
                 <span style="flex-basis:12rem;overflow:hidden;text-overflow: ellipsis;white-space: nowrap">服务名: {{item.shop_name}}</span>
                  <!-- <span style="flex-basis:6rem">店铺地址: {{item.shop_addr}}</span> -->
                  <span style="flex-basis:8rem">服务类型: {{item.serveName}}</span>
                  <div style="margin-top:.6rem;width:12rem"></div>
                  <!-- <span><router-link :to='`/editShop/${item.serve_id}`'><el-button>编辑服务</el-button></router-link></span> -->
                  <span><router-link :to='chooseEditPage(item.serve_id, item.serve_type)'><el-button>编辑服务</el-button></router-link></span>
                  <el-button @click="cancelShop(item.serve_id)">休业</el-button>
              </div>
          </section>
      </div>
      <div v-show="showType==='down'" class="shop_list_container" @scroll="getShopMenuByPage($event, 2)">
          <van-empty description="暂无数据" v-if="!down||down.length<=0">
          </van-empty>
          <section v-for="item in down" :key="item.serve_id" class="shoplist" v-else>
              <img src="@/assets/shopcart.png" alt="" v-show="!item.shop_pic">
              <img :src="item.shop_pic" alt="" v-show="item.shop_pic">
              <div class="details">
                  <span style="flex-basis:12rem;overflow:hidden;text-overflow: ellipsis;white-space: nowrap">服务名: {{item.shop_name}}</span>
                  <span style="flex-basis:8rem">服务类型: {{item.serveName}}</span>
                  <div style="margin-top:.6rem;width:12rem"></div>
                  <!-- <span><router-link :to='`/editShop/${item.serve_id}`'><el-button>编辑服务</el-button></router-link></span> -->
                  <span><router-link :to='chooseEditPage(item.serve_id, item.serve_type)'><el-button>编辑服务</el-button></router-link></span>
                  <el-button @click="publishShop(item.serve_id, item.serve_type)">营业</el-button>
              </div>
          </section>
      </div>
      <div v-show="showType==='audit'" class="shop_list_container" @scroll="getShopMenuByPage($event, 0)">
           <van-empty description="暂无数据" v-if="!audit||audit.length<=0">
          </van-empty>
          <section v-for="item in audit" :key="item.serve_id" class="shoplist">
              <img src="@/assets/shopcart.png" alt="">
              <div class="details">
                  <span style="flex-basis:12rem;overflow:hidden;text-overflow: ellipsis;white-space: nowrap">服务名: {{item.shop_name}}</span>
                  <span style="flex-basis:8rem">服务类型: {{item.serveName}}</span>
                  <!-- <span style="flex-basis:6rem">店铺地址: {{item.shop_addr}}</span> -->
                  <div style="margin-top:.6rem;width:12rem"></div>
                  <!-- <span><router-link :to='`/editShop/${item.serve_id}`'><el-button>编辑商铺</el-button></router-link></span> -->
              </div>
          </section>
      </div>
      <div v-show="showType==='fail'" class="shop_list_container" @scroll="getShopMenuByPage($event, 3)">
           <van-empty description="暂无数据" v-if="!fail||fail.length<=0">
          </van-empty>
          <section v-for="item in fail" :key="item.serve_id" class="shoplist">
              <img src="@/assets/shopcart.png" alt="">
              <div class="details">
                  <span style="flex-basis:12rem;overflow:hidden;text-overflow: ellipsis;white-space: nowrap">服务名: {{item.shop_name}}</span>
                  <span style="flex-basis:8rem">服务类型: {{item.serveName}}</span>
                  <!-- <span style="flex-basis:6rem">店铺地址: {{item.shop_addr}}</span> -->
                  <div style="margin-top:.6rem;width:12rem"></div>
                  <!-- <span><router-link :to='`/editShop/${item.serve_id}`'><el-button>编辑商铺</el-button></router-link></span> -->
              </div>
          </section>
      </div>
  </div>
</template>

<script>
import axios from 'axios';
import headTop from '../components/head.vue'
import config from '@/../myConfig'
import { Toast } from 'vant';
var that = {}
export default {
    data(){
        return {
            audit: [], //审核中
            on: [],  //上架
            down: [], //下架
            fail: [], //审核失败
            showType:'on',
            size: 10,
            onTotalPage: null,
            downTotalPage: null,
            auditTotalPage: null,
            failTotalPage: null,
            onPage: 1,
            downPage: 1,
            auditPage: 1,
            failPage: 1,
        }
    },
    components:{
        headTop
    },
    methods:{
        cancelShop(serve_id){
            axios.post(`/private/updateServStatus`,{
                status: 2,
                serve_id
            }).then(res => {
                if(res.data.status === 0 ) {
                    this.on.forEach(item => {
                        if(item.serve_id == serve_id) {
                            item.status = 2
                            this.down.push(item)
                        }
                    })
                    this.on = this.on.filter(item => {
                        return item.serve_id != serve_id
                    })
                    // Toast('下架成功')
                }
            })
        },
        publishShop(serve_id, type){
            if(type==1||type==9){
                this.isShopNothing(serve_id).then(res => {
                    if(res.data.status === 0) {
                        if(res.data.data.length>0) {
                            axios.post(`/private/updateServStatus`,{
                                status: 1,
                                serve_id
                            }).then(res => {
                                if(res.data.status === 0) {
                                    this.down.forEach(item => {
                                        if(item.serve_id == serve_id) {
                                            item.status = 2
                                            this.on.push(item)
                                        }
                                    })
                                    this.down = this.down.filter(item => {
                                        return item.serve_id != serve_id
                                    })
                                }
                            })
                        } else {
                            Toast('商店为空，不能上架')
                        }
                    }
                })
            }
            else {
                axios.post(`/private/updateServStatus`,{
                    status: 1,
                    serve_id
                }).then(res => {
                    if(res.data.status === 0) {
                        this.down.forEach(item => {
                            if(item.serve_id == serve_id) {
                                item.status = 2
                                this.on.push(item)
                            }
                        })
                        this.down = this.down.filter(item => {
                            return item.serve_id != serve_id
                        })
                    }
                })
            }
            
        },
        isShopNothing(serve_id){
            return  axios.get(`/private/getGoodsByServeId?serve_id=${serve_id}`)
        },
        async getShopMenuByStatus(status){
            if(status === 0) {
                await axios.get(`/private/getShopMenu?status=${status}&size=${this.size}&page=${this.auditPage}`).then(res => {
                    if(res.data.status === 0) {
                        let _data = res.data.data;
                        _data.data.forEach(item => {
                            if(item.shop_pic) {
                                item.shop_pic = config.serverIp + item.shop_pic 
                            }
                            switch (item.serve_type) {
                                case '1':
                                    item.serveName =  '售卖(衣服、食品)'
                                    break;
                                case '2':
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
                            this.audit.push(item)
                        })
                        this.auditPage++
                        this.auditTotalPage = _data.totalPage
                    }
                })
            }
            else if ( status === 1) {
                await axios.get(`/private/getShopMenu?status=${status}&size=${this.size}&page=${this.onPage}`).then(res => {
                    if(res.data.status === 0) {
                        let _data = res.data.data;
                        _data.data.forEach(item => {
                            if(item.shop_pic) {
                                item.shop_pic = config.serverIp + item.shop_pic 
                            }
                            switch (item.serve_type) {
                                case '1':
                                    item.serveName =  '售卖(衣服、食品)'
                                    break;
                                case '2':
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
                            this.on.push(item)
                        })
                        this.onPage++
                        this.onTotalPage = _data.totalPage
                    }
                })
            }
            else if(status === 2){
                await axios.get(`/private/getShopMenu?status=${status}&size=${this.size}&page=${this.downPage}`).then(res => {
                    if(res.data.status === 0) {
                        let _data = res.data.data;
                        _data.data.forEach(item => {
                            if(item.shop_pic) {
                                item.shop_pic = config.serverIp + item.shop_pic 
                            }
                            switch (item.serve_type) {
                                case '1':
                                    item.serveName =  '售卖(衣服、食品)'
                                    break;
                                case '2':
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
                            this.down.push(item)
                        })
                        this.downPage++
                        this.downTotalPage = _data.totalPage
                    }
                })
            }
            else if(status === 3){
               await axios.get(`/private/getShopMenu?status=${status}&size=${this.size}&page=${this.downPage}`).then(res => {
                    if(res.data.status === 0) {
                        let _data = res.data.data;
                        _data.data.forEach(item => {
                            if(item.shop_pic) {
                                item.shop_pic = config.serverIp + item.shop_pic 
                            }
                            switch (item.serve_type) {
                                case '1':
                                    item.serveName =  '售卖(衣服、食品)'
                                    break;
                                case '2':
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
                            this.fail.push(item)
                        })
                        this.failPage++
                        this.failTotalPage = _data.totalPage
                    }
                }) 
            }
        },
        getShopMenuByPage(e, status) {
            if(e.target.scrollHeight - 20 < e.target.scrollTop + e.target.clientHeight) {
                if(status === 0) {
                    if(this.auditPage <= this.auditTotalPage) {
                        that._getShopMenuByStatus(status)
                    }
                } else if(status === 1) {
                    if(this.onPage <= this.onTotalPage) {
                        that._getShopMenuByStatus(status)
                    }
                } else if(status===2){
                    if(this.downPage <= this.downTotalPage) {
                        that._getShopMenuByStatus(status)
                    }
                }
                else if(status ===3 ){
                    if(this.downPage <= this.downTotalPage) {
                        that._getShopMenuByStatus(status)
                    }
                }
                
            }
        },
        toOn(){

            this.showType='on'
        },
        toDown(){
            this.showType='down'
            
        },
        toAudit(){
            this.showType='audit'
        },
        toFail(){
            this.showType='fail'
        },
        clearAndGetShopMenu(){
            this.fail = []
            this.on = []
            this.down= []
            this.audit = []
            this.failPage = 1
            this.onPage = 1
            this.downPage = 1
            this.auditPage = 1
            this.getShopMenuByStatus(0)
            this.getShopMenuByStatus(1)
            this.getShopMenuByStatus(2)
            this.getShopMenuByStatus(3)
        },
        chooseEditPage(id, type){
            if(type==2||type==3||type==9||type==5||type==6||type==7||type==8) {
                return `/service/${id}`
            }
            else if(type==1||type==4) {
                return `/editShop/${id}`
            }
            else return `/editShop/${id}`
        }
    },
    async activated() {
        this.clearAndGetShopMenu()
    },
    mounted() {
        
    },
    created() {
        that._getShopMenuByStatus = this._.throttle(this.getShopMenuByStatus, 900, {leading: false})
    }
}
</script>

<style scoped>
.shop_list_container {
    height: 24rem;
    overflow: scroll;
}
.common_nav{
    display: flex;
    padding: .25rem;
    margin-top: 2rem;
    font-size: .65rem;
}
.common_nav .item_status{
    box-sizing: border-box;
    width: 3rem;
    padding-bottom: 0.25rem;
    text-align: center;

}
.active{
    border-bottom: 0.08rem solid rgb(10, 3, 35);
    font-size: .75rem;
}
.shoplist{
    height: 4rem;
    padding: .25rem;
    font-size: 0.6rem;
    border-bottom: 0.03rem solid rgba(0, 0, 0, .1);
}
.shoplist img{
    width: 3.2rem;
    height: 3.2rem;
    vertical-align: top;
}
.shoplist span{
    display: block;
}
.details{
    float: right;
    display: flex;
    flex-wrap: wrap;
    /* justify-content: space-around; */
    align-items: center;
    width: 12rem;
}
.details span{
    display: inline-block;
    width: 4rem;
    line-height: 1rem;
   
}
.details button{
    border-radius: 0.15rem;
    color: #f1f1f1;
    padding: .28rem .4rem;
    /* margin: .2rem; */
    font-family: Helvetica Neue,Tahoma,Arial;
    background-color: blue;
    border-color: white;
}
</style>