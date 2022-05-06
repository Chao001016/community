<template>
  <div class="parent">
      <head-top :goBack="true" style="background-color:transparent" :userinfo="false" @click.native="maskshow = false"></head-top>
      <header class="header">
            <section class="head_left">
                <img :src="$route.query.shop_pic" alt="" v-if="$route.query.shop_pic">
                <img src="@/assets/goshopping.png" alt="" v-else>
            </section>
            <section class="head_right">
                <span class="title">1号店</span>
                <span>...</span>
                <span>无人</span>
            </section>
      </header>
      
      <nav class="nav">
          <div :class="{active_nav: nav==1}" @click="nav=1">商品</div>
          <div :class="{active_nav: nav==2}" @click="nav=2">评价</div>
      </nav>
      <router-view v-if="nav===2" :serve_id="id"></router-view>
      <div v-if="nav === 1">
          <div class="main">
            <aside class="aside">
                <section v-for="(item,index) in category" :key="item.id" :class="{cate:true, active_cate:showIndex==index}">
                    <div class="circle" v-if="item.num">{{item.num}}</div>
                    <a href="" v-scroll-to="{
                        el: '#a'+item.id,
                        container: '#article',
                        duration: 500,
                        lazy: false,
                        easing: 'linear',
                        offset: 0,
                        force: true,
                        cancelable: true,
                        onStart: ()=>{},
                        onDone: ()=>{},
                        x: false,
                        y: true
                    }" @click="locateCate(index,'a'+item.id)">{{item.cate}}</a>
                </section>
            </aside>
            <article class="article" id="article">
                <section class="cate_section" v-for="(item,index1) in goodslist" :key="item.id">
                    <div :id="'a'+item.id" class="cate_caption">{{item.name}}</div>
                    <section class="goods" v-for="(goods,index2) in item.goods" :key="goods.id">
                    <div class="pic_container">
                        <img :src="pic" alt="" v-for="(pic,index) in goods.goodsPic" :key="index">
                    </div>
                    <div class="description">
                        <span class="goods_name">{{goods.name}}</span>
                        <span></span>
                        <span class="goods_price">
                            <span>￥{{goods.price}}元 </span>
                            <div class="goods_change">
                                <button class="fun_btn" @click="removeCart(goods.id, item.id, index1, index2)" v-if="goods.buyednum">-</button>
                                <span>{{goods.buyednum}}</span>
                                <button class="fun_btn" @click="addCart(goods.id, index1, index2)">+</button>
                            </div>
                        </span>
                    </div>
                    </section>
                </section>
            </article>
            
          </div>
          <footer class="footer" ref="footer">
            <div class="mygoods_list" ref="mygoods">
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
                            label="商品数量">
                        </el-table-column>
                    </el-table>
            </div>
            <div class="func_div">
                <section class="goods_detail">
                <div class="shop_pic">
                    <img src="../assets/goods_list.png" alt="" @click="lookDetail">
                </div>
                </section>
                <section class="total_price">
                    <span class="fs1">￥{{totalPrice}}元</span>
                </section>
                <section class="take_order">
                    <!-- <router-link to="/confirmOrder">去结算</router-link> -->
                    <button @click="takeOrder()">去结算</button>
                </section>
            </div>
          </footer>
          <div class="mask" v-if="maskshow" @click="maskRemove"></div>
          <van-loading class="load" size="2rem" type="spinner" v-show="loading"></van-loading>
      </div>
  </div>
</template>

<script>
import headTop from '../components/head.vue'
import axios from 'axios'
import config from '@/../myConfig'
import { Toast } from 'vant'

export default {
    name: 'shopDetail',
    data() {
        return {
            id: null,
            nav: 1,
            category:[{id:'001',cate:'分类1',num:0},{id:'002',cate:'分类2',num:0},{id:'003',cate:'分类3',num:0}],
            goodslist: [
                {cate:'分类1',cateid:'001',goods:[{id:'001',price:1,name:'1',cate:'分类1',buyednum:0},{id:'002',price:1,name:'2',cate:'分类1',buyednum:0},{id:'003',price:1,name:'3',cate:'分类1'
                ,buyednum:0}]},
                {cate:'分类2',cateid:'002',goods:[{id:'004',price:1,name:'1',cate:'分类2',buyednum:0},{id:'005',price:1,name:'1',cate:'分类2',buyednum:0},{id:'006',price:1,name:'1',cate:'分类2',buyednum:0}]},
                {cate:'分类3',cateid:'003',goods:[{id:'007',price:1,name:'1',cate:'分类3',buyednum:0},{id:'008',price:1,name:'1',cate:'分类3',buyednum:0},{id:'009',price:1,name:'1',cate:'分类3',buyednum:0}]}
            ],
            showIndex: 0,
            shopCart: [],
            maskshow: false,
            cartshow: false,
            loading: true
        }
    },
    methods: {
        addCart (id, index1, index2) {
            console.log('addCart');
            //buyednum+1
            this.goodslist[index1].goods[index2].buyednum++
            // 往购物车里加商品
            let res = this.shopCart.every(item => {
                if(item.id === id){
                    item.num++;
                    return false
                }
                return true
            })
            if(res){
                let newgood = this.goodslist[index1].goods.filter(item => {
                                        return item.id === id
                                    })[0]
                console.log('newgood', newgood);
                this.shopCart.push({...newgood, num: 1})
            }
            // 计算每个种类购买了多少商品
            this.category.forEach(item1 => {
                let arr = this.shopCart.filter(goods => {
                    return item1.cate === goods.cate
                })
                let num = arr.reduce((total, item) => {
                    return total + item.num
                },0)
                item1.num = num
            })

        },
        removeCart(goodsid, cateid, index1, index2){
            console.log('removeCart')
            // buyednum-1
            this.goodslist[index1].goods[index2].buyednum--
            //购物篮移除
            this.shopCart.every((item,index) => {
                if(item.id === goodsid){
                    
                    if(item.num>0) item.num--;
                    else this.shopCart.splice(index,1)
                    if(item.num==0){
                        this.shopCart.splice(index,1)
                    }
                    return false
                }
                return true
            })
            //种类移除
            this.category.every((item)=>{
                if(item.id === cateid){
                    item.num--
                    return false
                }
                return true
            })
        },
        getGoodsByServeId(){
            this.goodslist = []
            this.category = []
            this.shopCart = []
            axios.get(`/private/getNotNullGoodsByServeId?serve_id=${this.id}`).then(res => {
                console.log(1212);
                if(res.data.status === 0){
                    let _data = res.data.data
                    _data.forEach(goods => {
                        // 初始化分类
                        let res = this.category.find((cate) => {
                            return cate.id === goods.section_id
                        })
                        if(!res){
                            this.category.push({cate: goods.goods_section, id: goods.section_id, num:0})
                        }
                        // 初始化shoplist
                        let temp_section = goods.goods_section; //保存分类名称
                        let rst = this.goodslist.every((item,index) => {
                            if(item.name === temp_section){
                                if(goods.goods_pic){
                                    goods.goods_pic = goods.goods_pic.split(',');
                                    goods.goods_pic = goods.goods_pic.map(item => {
                                        return config.serverIp + item
                                    })
                                }
                                item.goods.push({id: goods.goods_id, name: goods.goods_name, price: goods.goods_price, goodsRemark: goods.goods_remark, goodsPic:goods.goods_pic, buyednum:0,cate:goods.goods_section})
                                return false
                            }
                            return true
                        })
                        if(rst){
                            //校正数据数据格式
                            if(goods.goods_pic) {
                                goods.goods_pic = goods.goods_pic.split(',');
                                goods.goods_pic = goods.goods_pic.map(item => {
                                    return config.serverIp + item
                                })
                            }
                            // this.section.push({name: goods.goods_section, id:this.section.length+1 ,goods:[{goodsId: goods.goods_id, goodsName: goods.goods_name, goodsPrice: goods.goods_price, goodsRemark: goods.goods_remark,goodsPic:goods.goods_pic}]})
                            this.goodslist.push({name: goods.goods_section, id: goods.section_id ,goods:[{id: goods.goods_id, name: goods.goods_name, price: goods.goods_price, goodsRemark: goods.goods_remark,goodsPic:goods.goods_pic,buyednum:0,cate:goods.goods_section}]})
                        }
                    })
                    this.loading = false
                }
            })
        },
        locateCate(index,id){
            this.showIndex = index
            let div = document.getElementById(id);
            div.style.boxShadow = '0px 0px 5px blue inset'
            setTimeout(() => {
                div.style.boxShadow = 'none';
            },100)
            console.log(document.getElementById(id));
        },
        lookDetail(){
            let mygoods = this.$refs['mygoods']
            let footer = this.$refs['footer']
            this.maskshow = true
            footer.style.height = '12.1rem'
            mygoods.style.height = '10rem'
        },
        maskRemove(){
            this.maskshow = false;
            let mygoods = this.$refs['mygoods']
            mygoods.style.height = '0'
            let footer = this.$refs['footer']
            footer.style.height = '2.1rem'
        },
        takeOrder(){
            if(this.shopCart.length==0){
                Toast('还未选择商品')
                return
            }
            let _shopCart = [];
            this.shopCart.forEach( item => {
                 _shopCart.push({name: item.name, num: item.num, price: item.price})
                _shopCart.name = item.name
                _shopCart.num = item.num
            })
            this.$router.push({
                name: 'comfirmOrder',
                query: {
                    shopCart: JSON.stringify(_shopCart),
                    serve_id: this.id,
                    totalPrice: this.totalPrice
                }
            })
        },
        clearCart(){
            this.shopCart = []
        }
    },
    computed: {
        totalPrice(){
            let _totalPrice = this.shopCart.reduce((total,item) => {
                return total + item.num * item.price
            },0);
            return Number.parseFloat(_totalPrice).toFixed(2)
        }
    },
    components:{
        headTop
    },
    watch:{
        id: function(){
            this.getGoodsByServeId()
        }
    },
    activated(){
        this.id = this.$route.query.id
        console.log(this.id)
    },
    deactivated(){
        this.nav = 1
    },
    mounted() {
        // this.getGoodsByServeId()
    },
}
</script>

<style scoped>
.load{
    position: absolute;
    left: 7rem;
    top: 10rem;
}
.cate_caption{
    text-indent: .4rem;
    font-weight: 450;
    font-size: .65rem;
    color: rgb(140, 138, 138);
}
.cate_section{
    width: 100%;
}
.goods_change{
    float: right;
}
.circle{
    position: absolute;
    right: 0;
    min-width: .6rem;
    height: .6rem;
    color: white;
    line-height: .6rem;
    text-indent: 0;
    text-align: center;
    font-size: .5rem;
    /* border: 0.025rem solid red; */
    border-radius: 50%;
    background-color: red;
    
    
}
.take_order{
    width: 5rem;
    height: 100%;
    color: white;
    font-weight: 800;
    text-indent: 1rem;
    letter-spacing: .1rem;
    line-height: 2rem;
    background-color: rgb(98, 240, 98);
}
.take_order button{
    background-color: rgb(98, 240, 98);
    border: none;
}
.fs1{
    font-size: .9rem;
    color: white;
    font-weight: 800;
}
.total_price{
    width: 7.5rem;
    height: 100%;
    background-image: linear-gradient(to right,rgb(101, 87, 87),rgb(88, 52, 52));
}
.goods_detail{
    width: 3.5rem;
    height: 100%;
    background-image: linear-gradient(to right,black,rgb(101, 87, 87));
}
.shop_pic{
    display: block;
    box-sizing: border-box;
    width: 2.2rem;
    height: 2.2rem;
    border: 0.15rem solid black;
    border-radius: 50%;
    background-color: blue;
    transform: translate(.6rem, -.8rem);
    overflow: hidden;
}
.shop_pic img{
    position: relative;
    left: -.35rem;
    top: -.26rem;
    width: 2.6rem;
    height: 2.4rem;
}
.main{
    height: 22rem;
    border-bottom: 0;
    overflow: scroll;
}
.func_div{
   display: flex;
   width: 100%;
   height: 2.1rem; 
}
.footer{
    position: fixed;
    bottom: 0;
    width: 100%;
    /* height: 12.1rem; */
    /* 初始高度2.1 */
    height: 2.1rem;
    z-index: 999;
}
.mygoods_list{
    position: relative;
    width: 100%;
    height: 0;
    background-color: white;
    overflow: scroll;
}
.description{
    width: 100%;
    height: 100%;
    padding: 0 .2rem;
}
.description>span{
    display: block;
    width: 100%;
    height: 1.2rem;
}
.goods_name{
    font-size: .7rem;
    font-weight: 800;
}
.fun_btn{
    display: inline-block;
    box-sizing: border-box;
    height: 1rem;
    width: 1rem;
    border: 0.025rem solid blue;
    font-size:.45rem;
    color:white;
    border-radius: 0.125rem;
    background-color: blue;
    font-weight: bold;
    padding: 0.1rem 0.25rem;
}
.right_btn{
    float: right;
}
.goods_price{
    display: flex;
    color: orange;
    font-weight: 600;
    font-size: .6rem;
}
.pic_container img{
    width: 2.5rem;
    height: 2.5rem;
}
.goods{
    display: flex;
    box-sizing: border-box;
    width: 100%;
    height: 4rem;
    padding: .2rem;
    border-bottom: 0.0425rem solid rgb(228, 220, 220, .8);
}
.article{
    float: right;
    box-sizing: border-box;
    width: 78%;
    height: 19.8rem;
    border-bottom: 0;
    overflow: scroll;
    transition: all .25s linear;
}
.aside{
    float: left;
    box-sizing: border-box;
    width: 22%;
    /* height: 19.8rem; */
    height: 95%;
    border-bottom: 0.0425rem solid rgb(228, 220, 220, .8);
    border-right: 0.0425rem solid rgb(228, 220, 220);
    overflow: scroll;
}
.cate{
    position: relative;
    box-sizing: border-box;
    width: 100%;
    height: 3rem;
    border-bottom: 0.0825rem solid rgb(228, 220, 220, .4);
    line-height: 3rem;
    text-indent: .3rem;
    font-weight: 550;
    color: rgb(98, 98, 98);
    font-size: .7rem;
}
.header{
    box-sizing: border-box;
    width: 100%;
    height: 3.5rem;
    padding: .42rem .3rem;
    background-color: rgb(238, 237, 237);
    font-size: .65rem;
    
}
.head_left img{
    width: 2.5rem;
    height: 2.5rem;
}
.head_left{
    float: left;
}
.head_right{
    width: 12.5rem;
    float: right;

}
.head_right span{
    display: block;
}
.title{
    font-size: .75rem;
    font-weight: 700;
}
.nav{
    display: flex;
    justify-content: space-around;
    align-items: center;
    box-sizing: border-box;
    width: 100%;
    height: 2.2rem;
    border-bottom: .0225rem solid rgba(225, 214, 214, 0.4);
    font-size: .65rem;
}
.nav div{
    padding-bottom: .35rem;
}
.active_nav{
    border-bottom: .0825rem solid blue;
    color: rgb(83, 83, 241);
}
.active_cate{
    background-color: white;
    border-left: 0.2rem solid blue;
}
.mask{
    top: 0;
    position: fixed;
    width: 100%;
    height: 26rem;
    background-color: rgba(167, 160, 160, 0.6);
}
.parent{
    width: 100%;
    height: 100%;
}
</style>