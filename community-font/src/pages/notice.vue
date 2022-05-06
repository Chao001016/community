<template>
<div>
    <head-top :goBack='true' :userinfo="true"></head-top>
    <el-container class="container">
        <el-header style="height:2rem;padding:0" v-show="userInfo.user_type===0||userInfo.user_type===3">
            <nav class="nav">
                <div :class="{active_nav: nav==1}" @click="nav=1">查看通知</div>
                <div :class="{active_nav: nav==2}" @click="nav=2">发布通知</div>
            </nav>
        </el-header>
        <!-- 发布通知 -->
        <el-form label-width="4rem" v-show="nav==2 && (userInfo.user_type===0||userInfo.user_type===3)" ref="noticeForm" :model="noticeForm" class="form">
            <el-form-item label-width="0" :rules="[{ required: true, message: '请输入标题', trigger: 'blur' }]" prop="title">
                <el-input v-model="noticeForm.title" placeholder="请输入标题" class="input"></el-input>
            </el-form-item>
            <el-form-item label-width="0" :rules="[{ required: true, message: '请输入内容', trigger: 'blur' }]" prop="content">
                <el-input type="textarea" :autosize="{ minRows: 8, maxRows: 8}" v-model="noticeForm.content" placeholder="输入内容，不多于200字" class="input"></el-input>
            </el-form-item>
            <el-form-item label="接收对象:" label-width="3.8rem" prop="receiveType" :rules="[{ required: true, message: '请选择接收对象', trigger: 'blur' }]">
                <el-radio-group v-model="noticeForm.receiveType" >
                    <el-radio :label="0" border size="small">居民</el-radio>
                    <el-radio :label="1" border size="small">商家</el-radio>
                    <el-radio :label="2" border size="small">管理员</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-upload
                action="www.baidu.com"
                :http-request="uploadPic"
                list-type="picture-card"
                >
                <i slot="default" class="el-icon-plus"></i>    
                <div slot="file" slot-scope="{file}">
                <img
                    class="el-upload-list__item-thumbnail"
                    :src="file.url" v-show="file.url"
                >
                <span class="el-upload-list__item-actions">
                    <span
                    v-if="!disabled"
                    class="el-upload-list__item-delete"
                    @click="handleRemove(file)"
                    >
                    <i class="el-icon-delete"></i>
                    </span>
                </span>
                </div>
            </el-upload>
            <!-- <el-dialog :visible.sync="dialogVisible">
                <img width="100%" :src="dialogImageUrl" alt="">
            </el-dialog> -->
            <el-button type="primary" style="margin-top:.2rem" @click="publishNotice">发布</el-button>
        </el-form>
        <!-- 查看通知 -->
        <el-collapse  @change="handleChange" v-if="nav==1" >
            <transition-group name="slide-right">
                <el-collapse-item v-for="notice in notices" :key="notice.nid" :title="'标题:  '+ notice.title">
                    <div>{{notice.ncontent}}</div>
                    <div>
                        <van-uploader v-model="notice.preWatchPic" :deletable="false" :show-upload="false" preview-size="120"/>
                    </div>
                    <div class="right time">
                        ----------发布时间:{{notice.time}}
                    </div>
                    <br>
                    <div class="right" v-show="userInfo.user_type===0">
                        <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
                        <el-button type="primary" icon="el-icon-delete" size="mini" @click="deleteNotice(notice.nid)"></el-button>
                        <el-button type="primary" size="mini" @click="cancelPublish(notice.nid)" v-if="notice.nstatus===0">取消发布</el-button>
                        <el-button type="primary" size="mini" @click="continuePublish(notice.nid)" v-else>发布</el-button>
                    </div>
                </el-collapse-item>
            </transition-group>
            
        </el-collapse>
        <van-loading class="load" size="2rem" type="spinner" v-show="loading"></van-loading>
    </el-container> 
</div>
</template>

<script>
import headTop from '../components/head.vue'
import { mapState } from 'vuex'
import axios from 'axios'
import { Loading, Uploader, Dialog  } from 'vant'
import config from '@/../myConfig'

export default {
components: {
    [Dialog.Component.name]: Dialog.Component,
    [Loading.name]: Loading,
    [Uploader.name]: Uploader,
    headTop
  },
  data () {
    return {
        noticeForm: {
            title: null,
            content: null,
            receiveType: null
        },
        // title: '',
        // content: '',
        // receiveType: '',
        dialogImageUrl: '',
        dialogVisible: false,
        disabled: false,
        nav: 1,
        notices: [
            // {nid:'001',publisher:'002',ncontent:'我很好！',time:'2022-03-07',nstatus: 0, title:'标题1'},
            // {nid:'002',publisher:'003',ncontent:'我也很好！',time:'2022-03-07',nstatus: 1, title:'标题2'}
        ],
        files: [],
        loading: true,
        // activeNames: ['1']
    }
  },
  methods: {
    handleRemove(file) {
        file.url = null
        console.log(file);
    },
    publishNotice(){
        this.$refs['noticeForm'].validate((valid => {
            console.log(valid);
            if(valid){
                axios.post(`/private/insertNotice`, {
                    ncontent: this.noticeForm.content,
                    publisher: this.userInfo.uid,
                    title: this.noticeForm.title,
                    receiver: this.noticeForm.receiveType, //0居民，1商家，2管理员,3超级管理员
                    time: new Date().toLocaleDateString(),
                    nstatus: 0 // 0已发布，1未发布，2取消发布
                }).then(res => {
                    if(res.data.status === 0) {
                        Dialog({message: '发布成功'})
                        if(this.files.length > 0){
                            let nid = res.data.data.insertId
                            let formdata = new FormData()
                            for(let file of this.files){
                                formdata.append('file',file)
                            }
                            formdata.append('nid',nid)
                            axios.post(`/private/updateNPic`,formdata).then(res => {
                                if(res.data.status === 0){
                                    this.getNotices()
                                }
                            })
                        }
                        else this.getNotices()
                    }
                })
            }
        }))
    },
    getNotices(){
        axios.get(`/private/getNotice?user_type=${this.userInfo.user_type}`).then(res=>{
            if(res.data.status === 0){
                let _data = res.data.data
                _data.sort((item1,item2)=>{
                    
                })
                this.notices = _data
                for(let notice of this.notices){
                    if(notice.npic) {
                        this.$set(notice, 'preWatchPic', [])
                        notice.npic = notice.npic&&notice.npic.split(',')
                        notice.npic = notice.npic.map(item => {
                            return config.serverIp + item
                        })
                        notice.npic.forEach(item => {
                            notice.preWatchPic.push({url: item, isImage: true})
                        })
                    }
                }
                this.loading = false
            }
        })
    },
    deleteNotice(nid){
        axios.post(`/private/deleteNotice`,{
            nid
        }).then(res => {
            if(res.data.status === 0){
                this.notices = this.notices.filter(notice=>{
                    return notice.nid !== nid
                })
                console.log('deleteNoticeSucess');
            }
        })
    },
    handleChange(val) {
        console.log(val);
    },
    cancelPublish(nid){
        axios.post(`/private/cancelPublish`,{
            nid,
            nstatus:2
        }).then(res => {
            if(res.data.status === 0){
                
            }
        })
    },
    continuePublish(nid){
        axios.post(`/private/cancelPublish`,{
            nid,
            nstatus:0
        }).then(res => {
            if(res.data.status === 0){
                
            }
        })
    },
    uploadPic(val) {
        this.files.push(val.file);
    }
  },
  computed: {
      ...mapState(['userInfo'])
  },
  activated(){
      this.getNotices()
  },
  created() {
    //   this.getNotices()
  }
}
</script>

<style lang="css" scoped>
.van-uploader .van-uploader__upload{
    display: none;
}
.load{
    position: absolute;
    left: 7rem;
    top: 10rem;
}
/* .el-form-item >>> .el-form-item__content{
    font-size: 2rem;
} */
.container{
    height: 25rem;
    margin-top: 2rem;
    overflow: scroll;
}
.input::after{
    display: block;
    content: "";
    margin-top: .2rem;
}
.el-radio{
    margin-right: 0;
}
.el-form-item__label{
    color: rgb(216, 211, 211) !important;
}
.el-upload-list__item-thumbnail{
    width: 147px !important;
    height: 147px !important;
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
.active_nav{
    border-bottom: .0825rem solid blue;
    color: rgb(83, 83, 241);
}
.nav div{
    padding-bottom: .35rem;
}
.right{
    float: right;
}
.time{
    color: rgb(201, 198, 198); 
}
.img_holder{
    display: inline-block;
    padding: 0 .2rem;
}
.img_holder img{
    width: 147px;
    height: 147px;
}

.slide-right-enter-active {
  transition: all .2s ease;
}
.slide-right-leave-active {
  transition: all .2s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-right-enter, .slide-right-leave-to
/* .slide-fade-leave-active for below version 2.1.8 */ {
  transform: translateX(-8rem);
  opacity: 0;
}
</style>
