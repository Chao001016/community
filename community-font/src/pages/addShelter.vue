<template>
  <div>
      <head-top :goBack="true" :userinfo="true" :title="'服务入驻'"></head-top>
      <nav class="nav">
          <button class="fun_btn" @click="createShelter">新建服务</button>
      </nav>
      <div class="main" @scroll="getShopMenuByPage">
          <van-empty description="暂无数据" v-if="!shops||shops.length<=0">
          </van-empty>
          <section v-for="item in shops" :key="item.serve_id" class="shop_item">
              <img src="../assets/shopcart.png" alt="">
              <aside class="aside">
                  <div class="service_info">
                      <span>货架id: {{item.serve_id}}</span>
                      <span>服务状态: <em>{{item.serviceStatus}}</em> </span>
                  </div>
                  <div><router-link :to='`pubService/${item.serve_id}/1`'  class="fun_btn" v-if="item.serviceStatus==='未发布'">发布服务</router-link></div>
                  <div><router-link :to='`pubService/${item.serve_id}/0`'  class="fun_btn" v-if="item.serviceStatus==='审核中'">查看详情</router-link></div>
              </aside>
          </section>
      </div>
      <van-loading class="load" size="2rem" type="spinner" v-show="loading"></van-loading>
      <!-- <footGuide></footGuide> -->
  </div>
</template>

<script>
import axios from 'axios'
import headTop from '../components/head.vue'
import footGuide from '../components/foot.vue'
import { mapState } from 'vuex'
var that = {}
export default {
    data() {
        return {
            shops: [],
            loading: true,
            page: 1,
            size: 10,
            totalPage: null,
        }
    },
    components:{
        headTop,
        footGuide
    },
    methods:{
        async createShelter(){
            await axios.post('/private/createShelter',{
                userInfo: this.userInfo
            }).then(async res=>{
                if(res.data.status === 0){
                   this.page = 1
                   this.shops= []
                   this.getShopMenu()
                }
            }).catch(err => {
                console.log(err);
            })
            console.log(this.shops);
        },
        async getShopMenu(){
            await axios.get(`/private/getShopMenu?size=${this.size}&page=${this.page}&status=null`)
            .then(res => {
                if(res.data.status===0){
                    let _data = res.data.data
                    this.page++
                    this.totalPage = _data.totalPage
                    _data.data.sort(function(a,b){
                        return a.serve_id - b.serve_id
                    })
                    let _shop = _data.data.filter(item => {
                        return item.status != 1 && item.status != 2
                    })
                    for(let item of _shop){
                        if(item.status === null){
                            this.$set(item,'serviceStatus','未发布')
                        }
                        else if(item.status === 0){
                                this.$set(item,'serviceStatus','审核中')
                            }
                        else if(item.status === 1){
                            this.$set(item,'serviceStatus','已上架')
                        }
                        else{
                            this.$set(item,'serviceStatus','已下架')
                        }
                        this.shops.push(item)
                    }
                    this.loading = false
                }
            })
        },
        getShopMenuByPage(e){
            if(e.target.scrollHeight - 20 < e.target.scrollTop + e.target.clientHeight) {
                console.log(this.page,this.totalPage);
                if(this.page <= this.totalPage) {
                    that._getShopMenu()
                }
            }
        }
    },
    computed:{
        ...mapState(['userInfo'])
    },
    async created(){
        that._getShopMenu = this._.throttle(this.getShopMenu, 900, {leading: false})
        // this.getShopMenu()
    },
    activated() {
        this.page = 1
        this.shops= []
        this.getShopMenu()
    },
}
</script>

<style scoped>
.load{
    position: absolute;
    left: 7rem;
    top: 10rem;
}
body{
    font-size: .65rem;
}
.nav{
    display: flex;
    align-items: center;
    height: 1.4rem;
    border-bottom: .0625rem solid rgb(169, 163, 163);
    margin-top: 2rem;
    padding: .2rem .2rem;
}

.shop_item{
    width: 100%;
    height: 2.8rem;
    border-bottom: .0225rem solid rgb(176, 175, 175);
    padding: .4rem .2rem .2rem .2rem;
    /* line-height: 2.8rem; */
}
.shop_item img{
    height: 2.3rem;
    width: 2.3rem;
}
.shop_item .aside{
    float: right;
    width: 13rem;
    height: 100%;
    color: rgb(159, 154, 154);
    font-size: .6225rem;
}
.shop_item .aside div{
    display: block;
    margin-bottom: .6rem;
}
.main{
    width: 100%;
    height: 23rem;
    overflow-y: scroll;
    overflow-x: hidden;
}
.fun_btn{
    display: inline-block;
    width: auto;
    border: 0.025rem solid blue;
    font-size:.65rem;
    color:white;
    border-radius: 0.125rem;
    background-color: blue;
    font-weight: bold;
    padding: 0.1rem 0.25rem;
}
.service_info{
    display: flex;
    justify-content: left;
}
.service_info span{
    display: inline-block;
    margin-right: .4rem;
}
</style>