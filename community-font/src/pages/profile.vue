<template>
  <div class="profile_page">
        <head-top go-back='true'></head-top>
        <section>
            <section class="profile-number">
                <router-link to="" class="profile-link">
                    <van-uploader v-model="userinfo.userPic" :deletable="false" :show-upload="false" />
                    <!-- <img :src="userinfo.userPic" class="privateImage" v-if="true"> -->
                    <div class="user-info">
                        <p>{{userinfo.nickName || '请完善信息'}}</p>
                        <p>
                            <span class="user-icon">
                                <svg class="icon-mobile" fill="#fff">
                                    <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#mobile"></use>
                                </svg>
                            </span>
                            <span class="icon-mobile-number">{{userinfo.phone}}</span>
                        </p>
                    </div>
                    <span class="arrow">
                        <svg class="arrow-svg" fill="#fff">
                            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-right"></use>
                        </svg>
                    </span>
                </router-link>
            </section>
            <section class="info-data">
            </section>
            <section class="profile-1reTe">
                <!-- 我的店铺 -->
                <router-link to='/shopMenu' class="myorder" v-if="'10006' in per">
                    <aside>
                        <svg fill="#4aa5f0">
                            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#order"></use>
                        </svg>
                    </aside>
                    <div class="myorder-div">
                        <span>我提供的服务</span>
                        <span class="myorder-divsvg">
                            <svg fill="#bbb">
                                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-right"></use>
                            </svg>
                        </span>
                    </div>
                </router-link>
                <!-- 审核列表 -->
                <router-link to="/auditList" class="myorder" v-if="'10007' in per">
                    <aside>
                        <svg fill="#fc7b53">
                            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#point"></use>
                        </svg>
                    </aside>
                    <div class="myorder-div">
                        <span>审核列表</span>
                        <span class="myorder-divsvg">
                            <svg fill="#bbb">
                                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-right"></use>
                            </svg>
                        </span>
                    </div>
                </router-link>
                <!-- 车位管理 -->
                <!-- <router-link to="/parkManage" class="myorder" v-if="'10008' in per">
                    <aside>
                        <svg fill="#fc7b53">
                            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#point"></use>
                        </svg>
                    </aside>
                    <div class="myorder-div">
                        <span>车位管理</span>
                        <span class="myorder-divsvg">
                            <svg fill="#bbb">
                                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-right"></use>
                            </svg>
                        </span>
                    </div>
                </router-link> -->
                 <router-link to="/myOrder" class="myorder" v-if="'10009' in per">
                    <aside>
                        <svg fill="#fc7b53">
                            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#point"></use>
                        </svg>
                    </aside>
                    <div class="myorder-div">
                        <span>我的订单</span>
                        <span class="myorder-divsvg">
                            <svg fill="#bbb">
                                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-right"></use>
                            </svg>
                        </span>
                    </div>
                </router-link>
                 <!-- 报刊管理 -->
                <!-- <router-link to="/magazineManage" class="myorder" v-if="'10010' in per">
                    <aside>
                        <svg fill="#fc7b53">
                            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#point"></use>
                        </svg>
                    </aside>
                    <div class="myorder-div">
                        <span>报刊管理</span>
                        <span class="myorder-divsvg">
                            <svg fill="#bbb">
                                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-right"></use>
                            </svg>
                        </span>
                    </div>
                </router-link> -->
                <router-link to="/userManage" class="myorder" v-if="'10011' in per">
                    <aside>
                        <svg fill="#fc7b53">
                            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#point"></use>
                        </svg>
                    </aside>
                    <div class="myorder-div">
                        <span>用户权限管理</span>
                        <span class="myorder-divsvg">
                            <svg fill="#bbb">
                                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-right"></use>
                            </svg>
                        </span>
                    </div>
                </router-link>
                <!-- 个人中心 -->
                <router-link to='/myInfo' class="myorder" v-if="'10012' in per">
                    <aside>
                        <svg fill="#ffc636">
                            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#vip"></use>
                        </svg>
                    </aside>
                    <div class="myorder-div">
                        <span>我的信息</span>
                        <span class="myorder-divsvg">
                            <svg fill="#bbb">
                                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-right"></use>
                            </svg>
                        </span>
                    </div>
                </router-link>
                <router-link to='/sellerOrder' class="myorder" v-if="'10013' in per">
                    <aside>
                        <svg fill="#ffc636">
                            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#vip"></use>
                        </svg>
                    </aside>
                    <div class="myorder-div">
                        <span>商家订单</span>
                        <span class="myorder-divsvg">
                            <svg fill="#bbb">
                                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-right"></use>
                            </svg>
                        </span>
                    </div>
                </router-link>
            </section>
        </section>
        <foot-guide :index='2'></foot-guide>
        <transition name="router-slid" mode="out-in">
            <router-view></router-view>
        </transition>
 </div>
</template>

<script>
import headTop from '../components/head.vue'
import footGuide from '../components/foot.vue'
import axios from 'axios'
import { mapState } from 'vuex'
import config from '@/../myConfig'
import { Uploader  } from 'vant'
export default {
    components:{
        headTop,
        footGuide,
        [Uploader.name]: Uploader
    },
    data() {
        return {
            userinfo:{
                nickName: null,
                userPic: [],
                phone: null
            }
        }
    },
    methods: {
        getUserInfo () {
          axios.get(`/public/account/getUserInfo?uid=${this.userInfo.uid}`).then(res => {
              if(res.data.status === 0) {
                  let _data = res.data.data
                  this.userinfo.nickName = _data.nickname
                  this.userinfo.phone = _data.phone?_data.phone.slice(0,4)+ '****' + _data.phone.slice(7): null
                  this.userinfo.userPic = [{url: _data.phone?config.serverIp + _data.user_pic: require('../assets/default.png'), isImage: true}]
              }
          })
        }
    },
    computed: {
        ...mapState(['userInfo']),
        per(){
            return JSON.parse(this.$store.state.userInfo.permission)
        }
    },
    created () {
        
    },
    activated() {
        this.getUserInfo()
    },
    mounted(){
        console.log('profile');
    }
}
</script>

<style scoped>
.van-uploader >>> .van-uploader__preview-image{
    border-radius: 50%;
}
.profile_page span,p{
    font-family: Helvetica Neue,Tahoma,Arial;
}
.profile-number{
    padding-top:1.95rem;
    
}
.profile-link{
    display:block;
    display:flex;
    box-align: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    background:blue;
    padding: .666667rem .6rem;
    
}
.privateImage{
    display:inline-block;
    width: 2.5rem;
    height: 2.5rem;
    border-radius:50%;
    vertical-align:middle;
}
.privateImage-svg{
    width: 2.5rem;
    height: 2.5rem;
    background:#fff;
    border-radius:50%;
}
.user-info{
    margin-left:.48rem;
    -webkit-box-flex: 1;
    -ms-flex-positive: 1;
    flex-grow: 1;
   
}
.arrow{
    width: .46667rem;
    height: .98rem;
    display:inline-block;
    
}
.arrow svg{
    width: 100%;
    height: 100%;
}
.user-info  p{
    font-weight:700;
    font-size: .8rem;
    color: #fff;
}
.user-icon{
    width: 0.5rem;
    height: 0.75rem;
    display:inline-block;
    vertical-align:middle;
    line-height:0.75rem;
}
.icon-mobile-number{
    display:inline-block;
    font-size: .57333rem;
    color: #fff;
}
.icon-mobile{
    width: 100%;
    height: 100%;
}
.profile-1reTe{
    margin-top:.4rem;
    background:#fff;
}
.myorder{
    padding-left:1.6rem;
    display:flex;
    align-items: center;
}
.myorder-div{
    display:flex;
    justify-content:space-between;
    width:100%;
    border-bottom:1px solid #f1f1f1;
    padding:.433333rem .266667rem .433333rem 0;
    font-size: .7rem;
    color: #333;
}
.myorder-div span{
    display:block;
}
.myorder aside{
    width: .7rem;
    height: .7rem;
    margin-left:-.866667rem;
    margin-right:.266667rem;
    display:flex;
    align-items: center;
}
.myorder aside svg{
    width: 100%;
    height: 100%;
}
.myorder:nth-of-type(3) .myorder-div{
    border:0;
}
.myorder-divsvg{
    width: .46667rem;
    height: .46667rem;
}
.myorder-divsvg svg{
    width: 100%;
    height: 100%;
}
.info-data{
        width:100%;
        background:#fff;
        box-sizing: border-box;
        
}
.info-data ul .info-data-link{
    float:left;
    width:33.33%;
    border-right:1px solid #f1f1f1;
}
.info-data ul .info-data-link span{
    display:block;
    width:100%;
    text-align:center;
}
.info-data ul .info-data-top{
    padding: .853333rem 0 .453333rem;
    font-size: .55rem;
    color: #333;
    
}
.info-data ul .info-data-top b{
    display:inline-block;
    font-size: 1.2rem;
    color: #f90;
    font-weight:700;
    line-height:1rem;
    font-family: Helvetica Neue,Tahoma;
}
.info-data ul .info-data-bottom{
    font-size: .57333rem;
    color: #666;
    font-weight:400;
    padding-bottom:.453333rem;
}
.info-data ul .info-data-link:nth-of-type(2) .info-data-top b{
    color:#ff5f3e;
}
.info-data ul .info-data-link:nth-of-type(3) .info-data-top b{
    color:#6ac20b;
}
.info-data-link{
    border: 0 !important;
}
</style>