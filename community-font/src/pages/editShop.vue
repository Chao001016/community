<template>
<!-- section的格式 section = [ { name, goods:[{}] } ] -->
    <div style="height:100%;width:100%;overflow:hidden">
        <head-top :goBack="true" :userinfo="true" :title="'售卖服务管理'"></head-top>
        <div class="aside">
            <nav class="nav">
                <el-button @click="addCategory" class="fun_btn" type="primary" size="mini">添加分类</el-button>
            </nav>
            <transition-group name="slide-left">
                <section v-for="(item,index) in section" :key="item.id" :class="{cate:'true',active:showIndex==index}" @click="showIndex = index">
                    <input type="text" v-model="item.name" :class="{active:showIndex==index}">
                    <img src="../assets/recycle.png" alt="" class="delete" @click="deleteCate(item.name,index)">
                    <!-- <button @click="deleteCate(item.name,index)" :class="{active:showIndex==index}"><img src="../assets/minus.png" alt="" class="delete"></button> -->
                </section>
            </transition-group>
            
        </div>
        <div class="main">
            <div v-for="(item,index1) in section" :key="item.id"  v-show="index1 === showIndex">
                 <nav class="nav">
                    <el-button @click="addGoods(index1)" class="fun_btn" type="primary" size="mini">在该类中添加商品</el-button>
                </nav>
                <transition-group name="slide-right">
                    <section v-for="(goods,index2) in item.goods" :key="goods.goodsId" class="goods-form">
                        <div class="goods_form_item head">
                            商品id:{{goods.goodsId}}
                            <span @click="putUpGoods" class="putup"><img src="../assets/minus.png" alt="" class="putup"></span>
                            <button @click="deleteByGoodsId(index1, index2)" class="deleteGoods">删除</button>
                            <button @click="submitForm(index1, index2)" class="deleteGoods">保存</button>
                        </div>
                        <div class="goods_form_item">
                            <input type="text" placeholder="商品名称" v-model="goods.goodsName" >
                        </div>
                        <div class="goods_form_item">
                            <input type="text" placeholder="商品价格￥" v-model="goods.goodsPrice">
                        </div>
                        <div class="goods_form_item">
                            <input type="text" placeholder="商品描述" v-model="goods.goodsRemark">
                        </div>
                        <div class="goods_form_item">
                            <p for="upload">商品图片</p>
                            <label :for="'upload'+goods.goodsId" class="label" v-if="!goods.goodsPic">
                                <div class="img_delete">
                                    <img src="../assets/add.png" class="goods_pic">
                                </div>
                            </label>
                            <div class="label" v-else>
                                <div class="img_delete">
                                    <img src="../assets/delete.png" alt="" class="delete right_top" @click="deletePic(index1,index2)">
                                    <img :src="goods.goodsPic" class="goods_pic">
                                </div>
                            </div>
                            <input type="file" placeholder="输入商品图片" :ref="`${item.name}${goods.goodsId}`" multiple hidden :id="'upload'+goods.goodsId" @change="upload($event,index1,index2)">
                        </div>
                        
                    </section>
                </transition-group>
                    
            </div>
        </div>
        <div id='foot_guide'>
            <nav class="display-flex width-100">
            <div class="nav-foot">
                <div class="nav-item">
                    <span @click="bottomPopup=true">修改店铺信息</span>
                </div>
            </div>
            </nav>
        </div>
        <!-- 弹出层 -->
        <van-popup v-model="bottomPopup" position="bottom" :style="{ height: '60%' }" >
            <van-form @submit="updateShopInfo">
                <van-cell-group inset>
                    <van-field 
                    name="serveType"
                    label="服务类型"
                    class="form_item"
                    label-class="label_class"
                    :rules="[{ required: true, message: '请选择服务类型' }]"
                    >
                        <template #input>
                            <van-radio-group v-model="shopInfo.serveType" direction="horizontal" :disabled="true">
                            <van-radio name="1" value="1">食物</van-radio>
                            <van-radio name="2" value="2">家电维修</van-radio>
                            </van-radio-group>
                        </template>
                    </van-field>
                    <van-field
                    v-model="shopInfo.shopName"
                    name="shopName"
                    label="服务名"
                    placeholder="商家店名"
                    class="form_item"
                    autocomplete="off" 
                    :rules="[{ required: true, message: '请填写商家店名' }]"
                    />
                    <van-field
                    v-model="shopInfo.shopAddr"
                    name="shopAddr"
                    label="商家地址"
                    placeholder="商家地址"
                    class="form_item"
                    autocomplete="off" 
                    :rules="[{ required: true, message: '请选择服务商家地址' }]"
                    />
                    <van-field name="license" label="服务图片" class="form_item">
                        <template #input>
                            <van-uploader v-model="shopInfo.shopPic" :max-count="1" preview-size="110"/>
                        </template>
                    </van-field>
                </van-cell-group>
                <div style="margin: 16px;">
                    <van-button round block type="primary" native-type="submit">
                    保存
                    </van-button>
                </div>
            </van-form>
        </van-popup>
    </div>
</template>

<script>
import axios from 'axios'
import headTop from '../components/head.vue'
import footGuide from '../components/foot.vue'
import { mapState } from 'vuex'
import config from '@/../myConfig'
import { Popup, Toast } from 'vant';
import { Form, Field, CellGroup, Button, Uploader, RadioGroup, Radio, Dialog  } from 'vant'
export default {
  components:{
    headTop,
    footGuide,
    [Dialog.Component.name]: Dialog.Component,
    [Form.name]: Form,
    [Field.name]: Field,
    [CellGroup.name]: CellGroup,
    [Button.name]: Button,
    [Uploader.name]: Uploader,
    [RadioGroup.name]: RadioGroup,
    [Radio.name]: Radio,
    [Popup.name]: Popup
  },
  data () {
    return {
        section: [],
        showIndex: 0,
        bottomPopup: false,
        shopInfo: {
            shopName: '',
            serveType: '',
            shopAddr: '',
            shopPic: []
        }
    }
  },
methods:{
      //增加分类
      addCategory(){
          axios.post(`/private/addCategory`,{
              serve_id: this.id,
              goods_section: '类名'+(this.section.length+1)
          }).then(res => {
              if(res.data.status === 0){
                  let _data = res.data.data
                  this.section.push({name:'类名'+(this.section.length+1),goods:[],id: _data.section_id})
                  this.showIndex = this.section.length-1;
                  this.$nextTick(()=>{
                      this.section[this.section.length-1].goods.push({goodsId: _data.goods_id, goodsName:'',goodsPrice:'',goodsRemark:'',goodsPic:'',section_id: _data.section_id})
                  })
              }
          })
          
      },
      //提交表单
      submitForm(index1, index2){
            console.log('submitForm');
            let goods = this.section[index1].goods[index2]
            let catename = this.section[index1].name
            if(!goods.goodsPic){
                    Dialog({message: `未上传图片`})
            }
            else if(!goods.goodsName){
                Dialog({message: `未填写名字`})
            }
            else{
                axios.post(`/private/updateGoods`,{
                    goods_name: goods.goodsName,
                    goods_price: goods.goodsPrice,
                    goods_remark: goods.goodsRemark,
                    goods_section: catename,
                    goods_id: goods.goodsId,
                }).then(res=> {
                    if(res.data.status === 0) {
                        let files = this.$refs[catename + goods.goodsId][0].files
                        if(files.length > 0) {
                            let formdata = new FormData();
                            formdata.append('goods_id',goods.goodsId);
                            formdata.append('file', files[0])
                            axios.put(`/private/uploadGoodsPicture`,formdata).then(res => {
                                if(res.data.status === 0){
                                    Toast({message:'保存成功'})
                                }
                            }).catch(err => {
                            })
                        }
                        else {
                            Toast({message:'保存成功'})
                        }
                    }
                })
            }
      },
      //增加商品
      addGoods(index){
          console.log('addGoods');
          console.log(this.section);
          axios.post(`/private/addGoods`,{serve_id: this.id,goods_section:this.section[index].name, section_id:this.section[index].id}).then(res => {
              if(res.data.status === 0){
                  console.log('新增商品成功');
                  this.section[index].goods.push({goodsId: res.data.data.goods_id, goodsName:'',goodsPrice:'',goodsRemark:'',goodsPic:''})
              }
          }).then(res => {
          }).catch(err => {
              console.log(err);
          })
      },
      //获取商品
      getCateAndGoods(){
          axios.get(`/private/getGoodsByServeId?serve_id=${this.id}`).then(res => {
              if(res.data.status === 0){
                let data = res.data.data;
                data.forEach((goods,index) => {
                    let temp_section = goods.goods_section; //保存分类名称
                    let rst = this.section.every((item,index) => {
                        if(item.name === temp_section){
                            if(goods.goods_pic){
                                goods.goods_pic = goods.goods_pic.split(',').map(item => {
                                    return config.serverIp + item
                                });
                            }
                            item.goods.push({goodsId: goods.goods_id, goodsName: goods.goods_name, goodsPrice: goods.goods_price, goodsRemark: goods.goods_remark, goodsPic:goods.goods_pic})
                            return false
                        }
                        return true
                    })
                    if(rst){
                        //校正数据数据格式
                        if(goods.goods_pic) {
                            goods.goods_pic = goods.goods_pic.split(',').map(item => {
                                return config.serverIp + item
                            });
                        }
                        // this.section.push({name: goods.goods_section, id:this.section.length+1 ,goods:[{goodsId: goods.goods_id, goodsName: goods.goods_name, goodsPrice: goods.goods_price, goodsRemark: goods.goods_remark,goodsPic:goods.goods_pic}]})
                        this.section.push({name: goods.goods_section, id: goods.section_id ,goods:[{goodsId: goods.goods_id, goodsName: goods.goods_name, goodsPrice: goods.goods_price, goodsRemark: goods.goods_remark,goodsPic:goods.goods_pic}]})
                    }
                    
                })
              }
              
          }).catch(err => {

          })
          console.log(this.section);
      },
      //删除商品
      deleteByGoodsId(index1, index2){
          console.log(this.section);
          let goodsId = this.section[index1].goods[index2].goodsId;
          axios.delete(`/private/deleteGoodsByGoodsId?goods_id=${goodsId}`).then(res => {
              if(res.data.status === 0){
                  this.section[index1].goods.splice(index2,1);
              }
          })
      },
      //删除分类
      deleteCate(cate, index){
          axios.delete(`/private/deleteCategory?goods_section=${cate}&serve_id=${this.id}`).then(res => {
              if(res.data.status === 0){
                  this.section[index].goods= []
                  setTimeout(()=>{
                      this.section.splice(index, 1);
                      this.index===0?this.index:this.index--;
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
              that.section[index1].goods[index2].goodsPic = this.result
          }
      },
      //删除商品图片
      deletePic(index1,index2){
          this.section[index1].goods[index2].goodsPic = ''
      },
      putUpGoods(e){
          if(e.path[3].style.height != '2rem'){
              e.path[3].style.height = '2rem'
          }
          else e.path[3].style.height = '12.5rem'
          
      },
      updateShopInfo(){
          console.log('updateShopInfo')
          axios.post(`/private/updateShopInfo`,{
              serve_type: this.shopInfo.serveType,
              shop_name: this.shopInfo.shopName,
              shop_addr: this.shopInfo.shopAddr,
              serve_id: this.id
          }).then(res => {
              if( res.data.status === 0) {
                  if(this.shopInfo.shopPic[0] && this.shopInfo.shopPic[0].file){
                      let formdata = new FormData();
                      formdata.append('serve_id', this.id);
                      formdata.append('file', this.shopInfo.shopPic[0].file)
                      axios.post(`/private/updateShopPic`, formdata).then(res => {
                          if(res.data.status === 0) {
                              Toast({message: '保存成功'})
                          }
                      })
                  }
                  else {
                      Toast({message: '保存成功'})
                  }
                  
              }
          })
      },
    getServiceById(){
        axios.get(`/private/getServiceById?id=${this.id}`).then(res => {
            if(res.data.status === 0){
                console.log(res.data);
                let data = res.data.data
                this.shopInfo.serveType = data.serve_type;
                this.shopInfo.shopName = data.shop_name;
                this.shopInfo.shopAddr = data.shop_addr;
                if(data.shop_pic){
                    this.shopInfo.shopPic = []
                    this.shopInfo.shopPic.push({
                        url: config.serverIp + data.shop_pic
                    })
                }
            }
        }).catch(err => {

        })
    }
      
  },
  props:['id'],
  activated(){
    
  },
  deactivated(){
      this.$destroy()
  },
  created(){
      this.getCateAndGoods()
      this.getServiceById()
  },
  watch:{
      id: function(){
        this.section = []
        this.getCateAndGoods()
      }
  }
}
</script>

<style scoped>
.form_item{
    font-size: .65rem;
    font-weight: 500;
    color: black !important;
}
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
    height: 24.6rem;
    margin-top: 2rem;
    overflow-x: hidden ;
    overflow-y: scroll;
}
.cate{
    box-sizing: border-box;
    width: 100%;
    height: 2rem;
    /* border: 0.0624rem solid #eee; */
    border-right: none;
    line-height: 2rem;
    text-align: center;
    /* font-size:0; */
    letter-spacing: -4px;
}
.cate input{
    box-sizing: border-box;
    width: 70%;
    border: 0;
    border-bottom: 0.0224rem solid rgba(204, 197, 197, .4);
    /* padding: .2rem 0; */
    font-family: Georgia, 'Times New Roman', Times, serif;
    font-weight: bolder;
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
    height: 12.5rem;
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
    font-weight: 800;
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
    /* display: inline-block;
    width: auto;
    border: 0.025rem solid blue;
    font-size:.65rem;
    color:white;
    border-radius: 0.125rem;
    background-color: blue;
    font-weight: bold;
    padding: 0.1rem 0.25rem; */
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
    line-height: 1.6rem;
    font-size:.55rem;
    color:white;
    border-radius: 0.125rem;
    background-color: rgb(109, 109, 118);
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
