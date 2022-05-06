<template>
    <div>
        <div class="func_menu">
            <van-uploader multiple v-model="filelist" :preview-image="false">
                <van-icon name="photo-o" size="1.2rem" style="height:1rem"/>
            </van-uploader>
        </div>
        <el-input placeholder="请输入内容" style=""  v-model="content">
            <el-button slot="append" size="medium" @click="deliver">发表</el-button>
        </el-input>
    </div>
</template>

<script>
import { Uploader } from 'vant'
import axios from 'axios'
import dayjs from 'dayjs'
import { mapState } from 'vuex'
export default {
  name: 'chat',
  components: {
      [Uploader.name]: Uploader
  },
  data () {
    return {
        filelist: [],
        content: ''
    }
  },
  methods: {
      deliver(){
          if(this.type === 'comment'){
                //发表评论
                this.content = this.content.trim()
                if(this.content){
                    console.log(1212);
                    axios.post(`/private/insertRate`,{
                        serve_id: this.serve_id,
                        content: this.content,
                        time: dayjs(new Date()).locale('zh-cn').format('YYYY-MM-DD HH:mm'),
                        uid: this.userInfo.uid
                    }).then(res => {
                        if(res.data.status === 0){
                            this.content = ''
                            let _data = res.data.data
                            if(this.filelist.length>0){
                                let formdata = new FormData()
                                formdata.append('rid', _data.rid)
                                this.filelist.forEach(item => {
                                    formdata.append('file', item.file)
                                })
                                axios.post(`/private/updateRPic`,formdata).then(res => {
                                    if(res.data.status === 0) {
                                        this.$emit('getRate')
                                    }
                                })
                            }
                            else this.$emit('getRate')
                        }
                    })
                }
              
          }
      },
      
  },
  computed:{
          ...mapState(['userInfo'])
  },
  props: ['type', 'serve_id'],
  mounted(){
  }
}
</script>

<style scoped>
.func_menu{
    width: 100%;
    height: 1.3rem;
}
</style>
