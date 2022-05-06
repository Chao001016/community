<template>
<!-- section的格式 section = [ { name, goods:[{}] } ] -->
    <div style="height:100%;width:100%;overflow:hidden">
        <head-top :goBack="true" :userinfo="true" :title="'报刊管理'"></head-top>
        <div class="aside">
            <nav class="nav">
                <button @click="addCategory" class="fun_btn">添加分类</button>
            </nav>
            <transition-group name="slide-left">
                <section v-for="(item,index) in section" :key="item.id" :class="{cate:'true',active:showIndex==index}" @click="showIndex = index">
                    <input type="text" v-model="item.name" :class="{active:showIndex==index}">
                    <img src="../assets/recycle.png" alt="" class="delete" @click="deleteCate(item.name,index)">
                </section>
            </transition-group>
            
        </div>
        <div class="main">
            <div v-for="(item,index1) in section" :key="item.id"  v-show="index1 === showIndex">
                 <nav class="nav">
                    <button @click="addMagazine(index1)" class="fun_btn">在该类中添加报刊</button>
                </nav>
                <transition-group name="slide-right">
                    <section v-for="(magazine,index2) in item.magazine" :key="magazine.mid" class="goods-form">
                        <div class="goods_form_item head">
                            <em>报刊ID:{{magazine.mid}}</em> 
                            <span @click="putUpGoods" class="putup"><img src="../assets/minus.png" alt="" class="putup"></span>
                            <button @click="deleteByMagazineId(index1, index2)" class="deleteGoods">删除</button>
                            <button @click="submitForm(index1, index2)" class="deleteGoods">保存</button>
                        </div>
                        <div class="goods_form_item">
                            <input type="text" placeholder="杂志名称" v-model="magazine.magazineName" >
                        </div>
                        <div class="goods_form_item">
                            <!-- <p for="upload">图片</p> -->
                            <label :for="'upload'+magazine.mid" class="label" v-if="!magazine.magazinePic">
                                <div class="img_delete">
                                    <img src="../assets/add.png" class="goods_pic">
                                </div>
                            </label>
                            <div class="label" v-else>
                                <div class="img_delete">
                                    <img src="../assets/delete.png" alt="" class="delete right_top" @click="deletePic(index1,index2)">
                                    <img :src="magazine.magazinePic" class="goods_pic">
                                </div>
                            </div>
                            <input type="file" placeholder="输入商品图片" :ref="`${item.name}${magazine.mid}`" multiple hidden :id="'upload'+magazine.mid" @change="upload($event,index1,index2)">
                        </div>
                        
                    </section>
                </transition-group>
                    
            </div>
        </div>
        <div id='foot_guide'>
            <nav class="display-flex width-100">
            <div class="nav-foot">
                <div class="nav-item">
                    <!-- <span @click="submitForm">编辑完成</span> -->
                </div>
            </div>
            </nav>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import headTop from '../components/head.vue'
import footGuide from '../components/foot.vue'
import { mapState } from 'vuex'
import config from '@/../myConfig'
import { Dialog } from 'vant'
export default {
  data () {
    return {
        section: [
            // {name:'',id:'',magazine:[{magazineName:'',magazinePic:'',mid:'',sectionId:''}]}
        ],
        showIndex: 0,
        show: true  //test
    }
  },
  methods:{
      //增加分类
      addCategory(){
          axios.post(`/private/addMCategory`,{
              magazine_section: '类名'+(this.section.length+1)
          }).then(res => {
              if(res.data.status === 0){
                  let _data = res.data.data
                  this.section.push({name:'类名'+(this.section.length+1),magazine:[],id: _data.section_id})
                  this.showIndex = this.section.length-1;
                  this.$nextTick(()=>{
                      this.section[this.section.length-1].magazine.push({mid: _data.mid, magazineName:'',magazinePic:'',section_id: _data.section_id})
                  })
              }
          })
      },
      //提交表单
      submitForm(index1,index2){
          console.log('submitForm');
          let magazine = this.section[index1].magazine[index2]
                if(!magazine.magazinePic){
                    Dialog({message: `未上传图片`})
                }
                else if(!magazine.magazineName){
                    Dialog({message: `未填写名字`})
                }
                else{
                    axios.post(`/private/updateMagazine`,{
                            magazine_name: magazine.magazineName,
                            magazine_section: this.section[index1].name,
                            mid: magazine.mid,
                    }).then(res=> {
                        if(res.data.status === 0) {
                            let files = this.$refs[this.section[index1].name + magazine.mid][0].files
                            if(files.length > 0) {
                                let formdata = new FormData();
                                formdata.append('mid',magazine.mid);
                                formdata.append('file', files[0])
                                axios.put(`/private/uploadMagazinePicture`,formdata).then(res => {
                                    if(res.data.status === 0){
                                            
                                    }
                                }).catch(err => {
                                })
                            }
                            
                        }
                    })
                }
      },
      //增加报刊
      addMagazine(index){
          console.log('addMagazine');
          axios.post(`/private/addMagazine`,{magazine_section:this.section[index].name, section_id:this.section[index].id}).then(res => {
              if(res.data.status === 0){
                  console.log('新增杂志成功');
                  this.section[index].magazine.push({mid: res.data.data.mid, magazineName:'' ,magazinePic:''})
              }
          }).then(res => {
          }).catch(err => {
              console.log(err);
          })
      },
      //获取报刊
      getCateAndMagazine(){
          axios.get(`/private/getMagazineManage`).then(res => {
              if(res.data.status === 0){
                let data = res.data.data;
                data.forEach((magazine,index) => {
                    let temp_section = magazine.magazine_section; //保存分类名称
                    let rst = this.section.every((item,index) => {
                        if(item.name === temp_section){
                            console.log('===');
                            if(magazine.magazine_pic){
                                magazine.magazine_pic = magazine.magazine_pic.split(',');
                                magazine.magazine_pic = magazine.magazine_pic.map(item => {
                                    return config.serverIp + item
                                })
                            }
                            item.magazine.push({mid: magazine.mid, magazineName: magazine.magazine_name, magazinePic:magazine.magazine_pic})
                            return false
                        }
                        return true
                    })
                    console.log(rst);
                    if(rst){
                        console.log('rst');
                        //校正数据数据格式
                        if(magazine.magazine_pic) {
                            magazine.magazine_pic = magazine.magazine_pic.split(',');
                            magazine.magazine_pic = magazine.magazine_pic.map(item => {
                                return config.serverIp + item
                            })
                        }
                        this.section.push({name: magazine.magazine_section, id: magazine.section_id ,magazine:[{mid: magazine.mid, magazineName: magazine.magazine_name, magazinePic: magazine.magazine_pic}]})
                    }
                    
                })
              }
              
          }).catch(err => {

          })
          console.log(this.section);
      },
      //删除报刊
      deleteByMagazineId(index1, index2){
          console.log(this.section);
          let mid = this.section[index1].magazine[index2].mid;
          axios.delete(`/private/deleteMagazineByMId?mid=${mid}`).then(res => {
              if(res.data.status === 0){
                  this.section[index1].magazine.splice(index2,1);
              }
          })
      },
      //删除分类
      deleteCate(cate, index){
          axios.delete(`/private/deleteCategory?magazine_section=${cate}`).then(res => {
              if(res.data.status === 0){
                  this.section[index].magazine= []
                  setTimeout(()=>{
                      this.section.splice(index, 1);
                      this.showIndex--;
                  },400)
                  console.log('删除成功');
              }
          })
      },
      //显示上传的图片
      upload(e,index1,index2){
          console.log('upload');
          if(!e || !window.FileReader)return
          let file = e.target.files[0]
          if(!file)return
          let that = this
          let reader = new FileReader()
          reader.readAsDataURL(file)
          reader.onloadend = function(){
              that.section[index1].magazine[index2].magazinePic = this.result
          }
      },
      //删除商品图片
      deletePic(index1,index2){
          this.section[index1].magazine[index2].magazinePic = ''
      },
      putUpGoods(e){
          if(e.path[3].style.height != '2rem'){
              e.path[3].style.height = '2rem'
          }
          else e.path[3].style.height = '7.5rem'
          
      }
  },
  components:{
      headTop,
      footGuide
  },
  props:['id'],
  activated(){
    
  },
  created(){
      this.getCateAndMagazine()
  }
}
</script>

<style scoped>
.aside{
    box-sizing: border-box;
    float: left;
    width: 25%;
    height: 25.2rem;
    margin-top: 2rem;
    border-right:.0225rem solid rgba(186, 182, 182, .4);
    overflow-y: scroll;
    overflow-x: hidden;
}
.main{
    box-sizing: border-box;
    float: left;
    width: 75%;
    height: 24.4rem;
    margin-top: 2rem;
    overflow-x: hidden ;
    overflow-y: scroll;
}
.cate{
    box-sizing: border-box;
    width: 100%;
    height: 2rem;
    border-right: none;
    line-height: 2rem;
    text-align: center;
    /* font-size:0; */
    letter-spacing: -4px;
}
.cate input{
    box-sizing: border-box;
    height: 1rem;
    width: 70%;
    border: 0;
    border-bottom: 0.0224rem solid rgba(204, 197, 197, .4);
    padding: 0;
    font-family: Georgia, 'Times New Roman', Times, serif;
    font-weight: bolder;
    font-size: .55rem;
}
.nav{
    display: flex;
    align-items: center;
    width: 100%;
    height: 1.5rem;
    padding: 0 .4rem;
    line-height: 1rem;
}
.goods-form{
    box-sizing: border-box;
    width: 100%;
    height: 7.5rem;
    border: 0.0624rem solid #eee;
    line-height: 1.5rem;
    border-bottom: 0.0225px solid rgb(174, 169, 169, .2);
    overflow-y: hidden;
    transition: height .25s linear;
}
.goods_form_item{
    box-sizing: border-box;
    width: 100%;
    padding: .2rem .4rem;
    border-bottom: .0225rem solid rgba(211, 206, 206, .4);
    font-size: 0.65rem;
}
.goods_form_item input{
    width: 100%;
    height: 1.5rem;
    border: none;
}
.head{
    height: 2rem;
    background-color: rgb(250, 246, 246);
    font-weight: 500;
}
.goods_pic{
    width: 2.5rem;
    height: 2.5rem;
    /* padding: 0 0.2rem; */
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
.active{
    background-color: rgb(247, 243, 243);
    border-left: 0.2rem solid blue;
}
.fun_btn{
    display: inline-block;
    width: auto;
    border: 0.025rem solid blue;
    font-size:.65rem;
    color:white;
    border-radius: 0.125rem;
    background-color: blue;
    font-weight: bold;
    padding: 0.1rem 0.25rem;
}
.delete{
    width: .6rem;
    height: .6rem;
}
.deleteGoods{
    float: right;
    width: auto;
    height: 1.6rem;
    border: 0.025rem solid white;
    padding: 0 0.25rem;
    /* margin-top: .1rem; */
    /* margin-right: 1.8rem; */
    line-height: 1.6rem;
    font-size:.55rem;
    color:white;
    border-radius: 0.125rem;
    background-color: rgb(127, 127, 186);
    font-weight: bold;
}
.right_top{
    position: absolute;
    top: -0.2rem;
    right: -0.2rem;
    animation: shiver 1s infinite;
}
.img_delete{
    position: relative;
    width: 2.6rem;
    height: 2.6rem;
    /* border: 0.0225rem solid rgb(167, 153, 153); */
}
.img_delete:hover .right_top{
    display: block;
}
.label{
    display: block;
    width: 2.8rem;
    height: 3rem;
}

.putup{
   float: right;
   margin: .1rem .2rem;
   
}
.putup img{
    width: 1rem;
    height: 1rem;
}

@keyframes shiver{
    0%{
        transform: scale(1);
    }
    10%,20%{
        transform: scale(0.9) rotate(-3deg);
    }
    30%,50%,70%,90%{
        transform: scale(1.2) rotate(3deg);
    }
    40%,60%,80%{
        transform: scale(1.2) rotate(-3deg);
    }
    100%{
        transform: scale(1) rotate(0);
    }
}

.slide-right-enter-active {
  transition: all .3s ease;
}
.slide-right-leave-active {
  transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-right-enter, .slide-right-leave-to
/* .slide-fade-leave-active for below version 2.1.8 */ {
  transform: translateX(8rem);
  opacity: 0;
}

.slide-left-enter-active {
  transition: all .3s ease;
}
.slide-left-leave-active {
  transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-left-enter, .slide-left-leave-to
/* .slide-fade-leave-active for below version 2.1.8 */ {
  transform: translateY(25rem);
}
</style>
