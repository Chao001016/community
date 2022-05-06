<template>
  <div>
      <head-top :goBack="true" :userinfo="true"></head-top>
      <nav class="msite_nav">
          <div class="swiper-container" v-if="funcMenu.length">
              <div class="swiper-wrapper">
                  <div class="swiper-slide menu_types_container" v-for="(item, index) in funcMenu" :key="index">
                      <router-link :to="{path:menuItem.path}" v-for="menuItem in item" :key="menuItem.id" class="link_to_menu" v-show="menuItem.show">
                          <figure>
                              <img :src="menuItem.pic_src" alt="">
                              <figcaption>{{menuItem.title}}</figcaption>
                          </figure>
                      </router-link>
                  </div>
              </div>
              <div class="swiper-pagination"></div>
          </div>
      </nav>
      <div class="shop_list_container" @scroll="getListByPage">
        <header class="shop_header">
            <svg class="shop_icon">
                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#shop"></use>
            </svg>
            <span class="shop_header_title">附近商家</span>
            <div>
                <van-dropdown-menu>
                    <van-dropdown-item v-model="sortItem" :options="sort" />
                    <van-dropdown-item v-model="typeItem" :options="type" />
                </van-dropdown-menu>
            </div>
            
            <section v-for="(item,index) in shopList" :key="index" :class="{'shop_item': true, 'height_4': item.serve_type!=1&&item.serve_type!=9}" >
                <img src="@/assets/goshopping.png" alt="" v-if="!item.shop_pic">
                <img :src="item.shop_pic" alt="" v-else>
                <aside class="aside">
                    <div class="service_info">
                        <span style="width:12rem;overflow:hidden;text-overflow: ellipsis;white-space: nowrap">服务名称: <em>{{item.shop_name}}</em> </span>
                        <!-- <span>地址：<em>{{item.shop_addr}}</em></span> -->
                        <span>类型：<em>{{item.serveName}}</em></span>
                    </div>
                    <div style="color:red" v-if="item.serve_type!=1&&item.serve_type!=9"><em>{{item.payway}}</em></div>
                    <!-- <div><router-link :to='{path: "/shopDetail", query: { id:item.serve_id, shop_pic: item.shop_pic }}'  class="fun_btn">进入商店</router-link></div> -->
                    <div><router-link :to='chooseShopPage(item.serve_id, item.shop_pic, item.serve_type)'  class="fun_btn">服务详情</router-link></div>
                </aside>
            </section>
        </header>
        <van-loading class="load" size="2rem" type="spinner" v-show="loading"></van-loading>
        <!-- <shop-list v-if="true" :geohash="geohash"></shop-list> -->
      </div>
      <foot-guide :index="0"></foot-guide>
  </div>
</template>

<script>
import headTop from '../components/head.vue'
import footGuide from '../components/foot.vue'
import '@/plugins/swiper-bundle.min.js'
import '@/../static/css/swiper-bundle.min.css'
import axios from 'axios'
import { Loading, Popover } from 'vant'
import config from '@/../myConfig'
import { mapState } from 'vuex'
var that = {}
export default {
    components:{
        headTop,
        footGuide,
        [Loading.name]: Loading,
        [Popover.name]: Popover,

    },
    data() {
        let per = JSON.parse(this.$store.state.userInfo.permission)
        return {
            funcMenu:[
                [{id:"01",title:"服务入驻",path:'/addShelter',pic_src:require('../assets/pubService1.png'), show: '10001' in per},
                {id:"02",title:"公告通知",path:'/notice',pic_src:require('../assets/broadcast.png'), show: '10002' in per},
                // {id:"03",title:"停车预定",path:'/park',pic_src:require('../assets/park.png'), show: '10003' in per},
                // {id:"04",title:"报刊订阅",path:'/magazine',pic_src:require('../assets/magazine.png'), show: '10004' in per}
                ]
            ],
            sortItem: 'all',
            typeItem: 0,
            sort: [{text:'默认排序', value: 'all'}, {text: '热度', value: 'orderNumber'}, {text: '好评', value: 'totalStar'}],
            type: [{text:'全部类型',value: 0},{text:'售卖(衣服、食品)',value: 1},{text:'修理',value: 2},{text:'清洁', value:3},
                        {text:'二手交易',value: 4},{text:'车位出租',value:5},{text:'装修', value:6},{text:'房屋出租',value:7},
                        {text:'搬家',value:8},{text: '艺术培训', value: 9}],
            
            shopList: [],
            loading: true,
            page: 1,
            size: 5,
            totalPage: null,
        }
    },
    computed: {
        ...mapState(['userInfo'])
    },
    methods:{
        async getServeByStatus(){
            await axios.get(`/private/getServeByStatus?status=1&size=${this.size}&page=${this.page}&sort=${this.sortItem}&type=${this.typeItem}`).then(res => {
                if(res.data.status === 0){
                    let _data = res.data.data
                    res.data.data.data.forEach(item => {
                        if(item.shop_pic){
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
                        this.shopList.push(item)
                    })
                    this.totalPage = _data.totalPage
                    this.page++
                    this.loading = false
                }
            })
        },
        getListByPage (e) {
            if(e.target.scrollHeight - 20 < e.target.scrollTop + e.target.clientHeight) {
                if(this.page <= this.totalPage) {
                    // let _getServeByStatus = this._.throttle(this.getServeByStatus, 3000)
                    that._getServeByStatus()
                }
            }
        },
        chooseShopPage(id, shop_pic, type){
            if(type==2||type==3||type==4||type==5||type==6||type==7||type==8) {
                console.log(`{path: "/serviceDetail", query: { id: ${id}, shop_pic: ${shop_pic }}}`);
                return {path: "/serviceDetail", query: { id: id, shop_pic: shop_pic }}
            }
            else if(type==1||type==9) {
                return {path: "/shopDetail", query: { id: id, shop_pic: shop_pic }}
            }
        }
    },
    activated(){
        this.shopList = []
        this.page = 1
        this.getServeByStatus()
    },
    created(){
        that._getServeByStatus = this._.throttle(this.getServeByStatus, 200, {leading: false})
    },
    mounted(){
        new Swiper('.swiper-container', {
		        pagination: {
                    el: '.swiper-pagination'
                },
		        loop: true
        });
        console.log('mysite');
    },
    watch: {
        sortItem(){
            this.page = 1,
            this.totalPage = null
            this.shopList = []
            this.getServeByStatus()
        },
        typeItem(){
            console.log('typeItem');
            this.page = 1,
            this.totalPage = null
            this.shopList = []
            this.getServeByStatus()
        }
    }
}
</script>

<style scoped>
.load{
    position: absolute;
    left: 7rem;
    top: 16rem;
}
.category{
    padding-top: 2.1rem;
}
.category_item{
    display: flex;
}
.msite_nav{
    padding-top: 2.1rem;
    background-color: #fff;
    border-bottom: 0.025rem solid #e4e4e4;
    height: 4.0rem;
}
.swiper-container{
    width: 100%;
    height: auto;
    padding-bottom: 0.6rem;
}
			
.fl_back{
    width: 100%;
    height: 100%;
}
.swiper-pagination{
    bottom: 0.2rem;
}
.menu_types_container{
    display:flex;
    flex-wrap: wrap;
		
}
.link_to_menu{
    display: flex;
	justify-content: center;
    width: 25%;
    padding: 0.3rem 0rem;
}    
figcaption{
    text-align: center;
    font-size: 0.45rem;
    transform: scale(0.9);
    color: #666;
}
img{
    width: 2.2rem;
    height: 1.8rem;
    margin-bottom: 0.3rem;
}
.shop_list_container{
    height: 20rem;
    margin-top: 0rem;
    border-top: 0.025rem solid #e4e4e4;
    background-color: #fff;
    overflow-x: hidden;
    overflow-y: scroll;
}
.shop_header {
    height: 1.2rem;
}
.shop_header_title{
    font-size: 0.55rem;
    line-height: 1.6rem;
    color: #999;
}
.shop_icon{
    width: 0.6rem;
    height: 0.6rem;
    fill: #999;
    margin-left: 0.6rem;
    vertical-align: middle;
}
.service_info{
    display: flex;
    justify-content: left;
}
.service_info span{
    display: inline-block;
    margin-right: .4rem;
}
.shop_item{
    width: 100%;
    height: 4rem;
    border-bottom: .0225rem solid rgb(176, 175, 175);
    padding: .4rem .2rem .2rem .2rem;
}
.height_4{
    height: 5rem;
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
</style>