<template>
  <div class="parent">
      <head-top :goBack="true" style="background-color:transparent" :userinfo="false" @click.native="maskshow = false"></head-top>
      <header class="header">
            <section class="head_left">
               <!-- <span class="title">1号店</span>
                <span>...</span>
                <span>无人</span> -->
            </section>
            <section class="head_right">
                
            </section>
      </header>
      <div class="main">
         <aside class="aside">
            <section v-for="(item,index) in category" :key="item.id" :class="{cate:true, active_cate:showIndex==index}">
                <!-- <div class="circle" v-if="item.num">{{item.num}}</div> -->
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
             <section class="cate_section" v-for="(item) in magazinelist" :key="item.id">
                <!-- <p>{{item.name}}123</p> -->
                <div :id="'a'+item.id" class="cate_caption">{{item.name}}</div>
                <section class="goods" v-for="(magazine) in item.magazine" :key="magazine.id">
                 <div class="pic_container">
                     <img :src="pic" alt="" v-for="(pic,index) in magazine.magazinePic" :key="index">
                 </div>
                 <div class="description">
                    <span class="goods_name">{{magazine.name}}</span>
                    <span></span>
                    <span class="goods_price">
                        <!-- <span>￥{{magazine.price}}元 </span> -->
                        <div class="goods_change">
                            <!-- <span>{{magazine.buyednum}}</span> -->
                            <el-button class="fun_btn" @click="magazine.count?'':selectCount(magazine.id)" :type="magazine.count?'danger':'primary'">{{magazine.count?`已订购${magazine.count}期`:'订购'}}</el-button>
                        </div>
                    </span>
                 </div>
                </section>
             </section>
         </article>
         <van-loading class="load" size="2rem" type="spinner" v-show="loading"></van-loading>
      </div>
      <!-- 弹出层 -->
      <van-popup v-model="showPicker" position="bottom">
        <van-picker
            title="选择期数"
            :show-toolbar="true"
            :columns="columns"
            @confirm="onConfirm"
            @cancel="showPicker = false"
        />
      </van-popup>
      <van-loading class="load" size="2rem" type="spinner" v-show="loading"></van-loading>
  </div>
</template>

<script>
import headTop from '../components/head.vue'
import axios from 'axios'
import { mapState } from 'vuex'
import { Dialog,Popup,Picker  } from 'vant'
import config from '@/../myConfig'
export default {
    components:{
        headTop,
        [Popup.name]: Popup,
        [Picker.name]: Picker 
    },
    data() {
        return {
            mid: null,
            category:[{id:'001',cate:'分类1',num:0},{id:'002',cate:'分类2',num:0},{id:'003',cate:'分类3',num:0}],
            magazinelist: [
            ],
            showIndex: 0,
            shopCart: [],
            loading: true,
            showPicker: false,
            columns: ['1','2','3','4','5']
        }
    },
    methods: {
        getMagazine(){
            this.magazinelist = []
            this.category = []
            this.shopCart = []
            axios.get(`/private/getMagazineCommon?uid=${this.userInfo.uid}`).then(res => {
                if(res.data.status === 0){
                    let _data = res.data.data
                    _data.forEach(magazine => {
                        // 初始化分类
                        let res = this.category.find((cate) => {
                            return cate.id === magazine.section_id
                        })
                        if(!res){
                            this.category.push({cate: magazine.magazine_section, id: magazine.section_id, num:0})
                        }
                        // 初始化shoplist
                        let temp_section = magazine.magazine_section; //保存分类名称
                        let rst = this.magazinelist.every((item,index) => {
                            if(item.name === temp_section){
                                if(magazine.magazine_pic){
                                    magazine.magazine_pic = magazine.magazine_pic.split(',');
                                    magazine.magazine_pic = magazine.magazine_pic.map(item => {
                                        return config.serverIp + item
                                    })
                                }
                                item.magazine.push({id: magazine.mid, name: magazine.magazine_name, magazinePic:magazine.magazine_pic, buyednum:0,cate:magazine.magazine_section,count: magazine.count})
                                return false
                            }
                            return true
                        })
                        if(rst){
                            //校正数据数据格式
                            if(magazine.magazine_pic) {
                                magazine.magazine_pic = magazine.magazine_pic.split(',');
                                magazine.magazine_pic = magazine.magazine_pic.map(item => {
                                    return config.serverIp + item
                                })
                            }
                            this.magazinelist.push({name: magazine.magazine_section, id: magazine.section_id ,magazine:[{id: magazine.mid, name: magazine.magazine_name, magazinePic:magazine.magazine_pic,buyednum:0,cate:magazine.magazine_section,count:magazine.count}]})
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
        preSubscribe (value) {
            axios.post(`/private/magazineOrder`,{
                uid: this.userInfo.uid,
                mid: this.mid,
                all_count: value
            }).then(res => {
                if(res.data.status === 0) {
                    Dialog({message: '预定成功'})
                    this.getMagazine()
                }
            })
        },
        selectCount(mid) {
            console.log(mid);
            this.mid = mid
            this.showPicker = true
        },
        onConfirm (value) {
            this.preSubscribe(value)
        }
    },
    computed: {
        ...mapState(['userInfo'])
        // totalPrice(){
        //     let _totalPrice = this.shopCart.reduce((total,item) => {
        //         return total + item.num * item.price
        //     },0);
        //     return Number.parseFloat(_totalPrice).toFixed(2)
        // }
    },
    mounted() {
        this.getMagazine()
        console.log('shopDetail');
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
    transform: translate(.6rem, -.8rem);
    overflow: hidden;
}
.shop_pic img{
    position: relative;
    left: -.28rem;
    top: -.25rem;
    width: 2.6rem;
    height: 2.4rem;
}
.main{
    height: 25rem;
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
    min-width: 2rem;
    /* border: 0.025rem solid blue; */
    font-size:.45rem;
    color:white;
    border-radius: 0.125rem;
    /* background-color: blue; */
    font-weight: bold;
    padding: 0.1rem 0.25rem;
}
.right_btn{
    float: right;
}
.goods_price{
    box-sizing: border-box;
    display: flex;
    color: orange;
    font-weight: 600;
    font-size: .6rem;
    padding: 0 1rem;
}
.pic_container img{
    width: 3.2rem;
    height: 3.2rem;
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
    height: 100%;
    border-bottom: 0;
    overflow: scroll;
    transition: all .25s linear;
}
.aside{
    float: left;
    box-sizing: border-box;
    width: 22%;
    /* height: 19.8rem; */
    height: 100%;
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
    background-image: url('../assets/newspaper.png');
    background-size: 12rem 4rem;
    background-position-x: 3rem;
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