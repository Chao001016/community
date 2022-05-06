<template>
  <div>
      <head-top :goBack="true" :userinfo="true" :title="'审核列表'"></head-top>
      <div class="main">
          <van-empty description="暂无数据" v-if="!auditingShops||auditingShops.length<=0">
          </van-empty>
          <section v-for="item in auditingShops" :key="item.serve_id" class="shop_item">
              <img src="@/assets/audit.png" alt="">
              <div class="aside">   
                  <span>服务id: {{item.serve_id}}</span>
                  <span>商店地址:{{item.shop_addr}}</span>
                  <span><router-link :to='`pubService/${item.serve_id}/0`'><el-button type="primary" size="mini">审核</el-button></router-link></span>
              </div>
              
          </section>
      </div>
      <!-- <foot-guide></foot-guide> -->
  </div>
</template>

<script>
import axios from 'axios'
import headTop from '../components/head.vue'
import footGuide from '../components/foot.vue'
import { mapState } from 'vuex'
export default {
    data() {
        return {
            auditingShops: []
        }
    },
    methods: {

    },
    components:{
        headTop,
        // footGuide
    },
    async created(){
        
    },
    async activated() {
        axios.get(`/private/getAuditShop`).then(res=>{
            if(res.data.status === 0){
                this.auditingShops = res.data.data;
            }
        }).catch(err=>{

        })
    },
}
</script>

<style scoped>
.audit{
    border-radius: 20%;
    width: 2rem;
}
.button_item{
    width: 4rem;
    height: 1.4rem;
}
.shop_item{
    width: 100%;
    height: 4rem;
    border: .0625rem solid rgb(181, 175, 175, .4);
}
.shop_item img{
    height: 3.5rem;
    width: 3.5rem;
    margin-top: .1rem;
}
.shop_item .aside{
    float: right;
    width: 12rem;
    height: 100%;
}
.shop_item .aside{
    display: flex;
    flex-direction: column;
    justify-content: left;
    flex-wrap: wrap;
    font-size: .6rem;
}
.shop_item .aside span{
    display: inline-block;
    width: 6rem;
    height: 1rem;
    padding: .1rem 0;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
}
.main{
    width: 100%;
    height: 24rem;
    margin-top: 2rem;
    overflow-y: scroll;
    overflow-x: hidden;
}
</style>