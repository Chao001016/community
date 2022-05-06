<template>
  <header id='head_top'>
    <section class="head_goback" v-if="goBack" @click="$router.go(-1)">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" version="1.1" style="margin-top:0.4rem"> 
          <polyline points="12,18 4,9 12,0" style="fill:none;stroke:rgb(255,255,255);stroke-width:2;"/>
      </svg>
    </section>
    <section class="title">{{title}}</section>
    <section class="right" v-if="userinfo">
      <van-popover v-model="loginInfoShow" :actions="accountOper" @select="onStateSelect">
        <template #reference>
          <!-- <van-button type="primary" @click="statePop=!statePop">状态筛选</van-button> -->
          <div @click="loginInfoShow=!loginInfoShow">
            <div class="user_pic" :style="{background:'url('+ userPic +') center center/2.2rem'}"></div>
            <div class="username">{{username}}</div>
          </div>
        </template>
      </van-popover>
    </section>
  </header>
</template>

<script>
import axios from 'axios'
import { mapState } from 'vuex'
import { Popover } from 'vant'
export default {
  components:{
    [Popover.name]: Popover,
  },
  data() {
    return {
      loginInfoShow: false,
      accountOper: [
        {text: '退出登录'}]
    }
    
  },
  props:['goBack','login','userinfo','title','exit'],
  methods: {
    onStateSelect( action ) {
      if(action.text === '退出登录') {
        this.loginOut()
      }
    },
    loginOut() {
      localStorage.removeItem('token')
      this.$router.replace({path: '/login'});
    }
  },
  mounted(){
    
  },
  computed:{
    ...mapState(['userInfo']),
    username(){
      if(this.userInfo.nickname){
        return `hi,${this.userInfo.nickname}`
      }
      else{
        return `请完善信息`
      }
    },
    userPic(){
        return this.userInfo.user_pic || require('../assets/default.png')
    }
  }
}
</script>

<style scoped>
#head_top{
  background-color: blue;
  position: fixed;
  z-index: 100;
  left: 0;
  top: 0;
  width: 100%;
  height: 1.95rem;
  font-size: 0.55rem;
}
.head_goback{
  width: 0.6rem;
  height: 1rem;
  left: 0.4rem;
  line-height: 2.2rem;
  margin-left: .4rem;
}
.right{
  float: right;
  transform: translate(0,-52%);
}
.user_pic{
  float: left;
  height: 1.5rem;
  width: 1.5rem;
  margin-right: .3rem;
  border-radius: 50%;
  background: url('../assets/default.png');
  background-size: 2.2rem;
  background-position: center;
  vertical-align: middle;
}
.username{
  float: right;
  max-width: 2.7rem;
  height: 1.5rem;
  color: rgb(186, 175, 175);
  white-space: nowrap;
  text-overflow: ellipsis;
  line-height: 1.5rem;
  overflow: hidden;
}
.title{
  float:left;
  color:white;
  font-size:.75rem;
  position:absolute;
  text-align: center;
  left:6rem;
  bottom:.6rem;
  letter-spacing: .1rem;
}
</style>