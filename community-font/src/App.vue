<template>
  <div>

    <keep-alive>
        <router-view></router-view>
    </keep-alive>
    <svg-icon></svg-icon>
  </div>
</template>

<script>
import svgIcon from './components/common/svg';
export default {
  name: 'App',
  components:{
    svgIcon
  },
  watch:{
    $route:function(from, to){
    }
  }
}
</script>

<style>
.slide-right-enter-active {
  transition: all .1s ease;
}
.slide-right-leave-active {
  transition: all .1s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-right-enter, .slide-right-leave-to
/* .slide-fade-leave-active for below version 2.1.8 */ {
  transform: translateX(4rem);
  opacity: 0;
}
</style>
