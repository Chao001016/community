<template>
  <div id='foot_guide'>
  <van-tabbar v-model="active" route>
  <van-tabbar-item icon="home-o" to="/mysite">服务圈</van-tabbar-item>
  <!-- <van-tabbar-item icon="search">搜索</van-tabbar-item> -->
  <van-tabbar-item icon="friends-o" to="/profile">个人中心</van-tabbar-item>
</van-tabbar>
  </div>
</template>

<script>
import { Tabbar, TabbarItem } from 'vant';
export default {
    components: {
        [Tabbar.name]: Tabbar,
        [TabbarItem.name]: TabbarItem
    },
    data() {
        return {
            active: 0
        }
    },
    methods:{
      
    },
    props:['index']
}
</script>

<style scoped>
.link{
    color: inherit;
}
#foot_guide{
    background-color: #fff;
    position: fixed;
    z-index: 100;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    width: 100%;
    height: 1.95rem;
    box-shadow: 0 -0.026667rem 0.053333rem rgba(0,0,0,.1);
}
.display-flex{
    display: flex;
}
.width-100{
    width: 100%;
}
.nav-foot{
    position: relative;
    width: 100%;
    height: 1.95rem;
    border: 1px solid rgba(0, 0, 0, .1);
    
}
.nav-item{
    line-height: 1.95rem;
    text-align: center;
}
</style>