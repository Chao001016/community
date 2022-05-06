<template>
    <div>
        <div class="rate_container">
            <van-empty description="暂无评论" v-if="!rates||rates.length<=0">
            </van-empty>
            <section v-for="item in rates" :key="item.rid" v-else>
                <header style="height:2rem">
                    <img :src="item.user_pic" alt="" class="img" v-if="item.user_pic">
                    <van-icon name="manager" size="2rem" v-else style="vertical-align:top" />
                    <span style="font-size:.55rem"><em>{{item.nickname}}</em></span>
                    <span style="float:right;font-size:.55rem;color:gray"><em>{{item.time}}</em></span>
                </header>
                <article class="content">
                    {{item.content}}
                </article>
            </section>
        </div>
        <footer class="add_comment" v-if="$route.query.comment">
            <chat :serve_id="serve_id" :type="'comment'" @getRate="getRate"></chat>
        </footer>
    </div>
</template>

<script>
import axios from 'axios'
import config from '@/../myConfig'
import chat from '@/components/chat'
export default {
  name: 'rate',
  components: {
      chat
  },
  data () {
    return {
        rates:[
        ]
    }
  },
  methods:{
    getRate(){
        axios.get(`/private/getRate?serve_id=${this.serve_id}&page=1&size=10`).then(res => {
            if(res.data.status === 0) {
                let _data = res.data.data
                _data.forEach(item => {
                    if(item.user_pic) item.user_pic = config.serverIp + item.user_pic
                })
                this.rates = _data
            }
        })
    }
  },
  created(){
    console.log(this.serve_id)
    this.getRate()
  },
  props: ['serve_id']
}
</script>

<style scoped>
.img{
    height: 2rem; 
    width:2rem;
    vertical-align:top;
    border-radius: 50%;
}
.rate_container{
    height: auto;
    overflow: scroll;
}
.content{
    max-height: 5rem;
    min-height: 2rem;
    padding-left:2rem;
    word-wrap: break-word;
    border-bottom: 1px solid rgb(224, 215, 215, .6);
    padding-bottom: .4rem;
    font-size: .60rem;
    text-overflow: ellipsis;
    overflow: hidden;
}
.add_comment{
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 2.8rem;
    border-top: 1px solid rgb(224, 215, 215, .6);
}
</style>
