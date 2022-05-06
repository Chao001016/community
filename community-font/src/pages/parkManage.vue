<template>
<!-- section的格式 section = [ { name, goods:[{}] } ] -->
    <div>
        <head-top :goBack="true" :userinfo="true" :title="'管理车位'"></head-top>
        <div class="aside">
            <nav class="nav">
                <button @click="addSpot" class="fun_btn">添加地点</button>
            </nav>
            <transition-group name="slide-left">
                <section v-for="(item,index) in section" :key="item.id" :class="{cate:'true',active:showIndex==index}" @click="showIndex = index">
                    <input type="text" v-model="item.name" :class="{active:showIndex==index}">
                    <img src="../assets/recycle.png" alt="" class="delete" @click="deleteSpot(item.name,index)">
                </section>
            </transition-group>
            
        </div>
        <div class="main">
            <div v-for="(item,index1) in section" :key="item.id"  v-show="index1 === showIndex">
                 <nav class="nav">
                    <button @click="addSeat(index1)" class="fun_btn">在该地点中添加车位</button>
                </nav>
                <transition-group name="slide-right">
                    <section v-for="(seat,index2) in item.seat" :key="seat.pid" class="goods-form">
                        <div class="goods_form_item head">
                            车位id:{{seat.pid}}
                            <button @click="deleteBypid(index1, index2)" class="deleteGoods">删除</button>
                        </div>
                        <div class="goods_form_item">
                            <input type="text" placeholder="车位号" v-model="seat.seatNumber" >
                        </div>
                    </section>
                </transition-group>
                    
            </div>
        </div>
        <div id='foot_guide'>
            <nav class="display-flex width-100">
            <div class="nav-foot">
                <div class="nav-item">
                    <span @click="submitForm">编辑完成</span>
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
import { Dialog, Toast } from 'vant'
export default {
  data () {
    return {
        section: [
            // {id:1,name:'天马',seat:[{pid:1,seatNumber:'A1'}]},
            // {id:2,name:'德智',seat:[{pid:1,seatNumber:'A1'}]},
        ],
        showIndex: 0,
        show: true  //test
    }
  },
  methods:{
      //增加分类
      addSpot(){
          axios.post(`/private/addSpot`,{
              spot: '地点'+(this.section.length+1)
          }).then(res => {
              if(res.data.status === 0){
                  console.log('添加成功');
                  let _data = res.data.data
                  this.section.push({name:'地点'+(this.section.length+1), seat:[], id: _data.spot_id})
                  this.showIndex = this.section.length-1;
                  this.$nextTick(()=>{
                      this.section[this.section.length-1].seat.push({pid: _data.pid, spotId: _data.spot_id, seatNumber: _data.seat_number})
                  })
              }
          })
          
      },
      //提交表单
      submitForm(){
          console.log('submitForm');
          //检验是否有重复车位号
          let seatnumArr = []
          for(let spot of this.section){
            for(let seat of spot.seat){
              seatnumArr.push(seat.seatNumber)
            }
          }
          console.log(seatnumArr);
          let norepeat = Array.from(new Set(seatnumArr))
          if(seatnumArr.length!=norepeat.length){
              Toast({message:'有重复的车位号'})
              return
          }
          //发送请求
          for(let spot of this.section){
              for(let seat of spot.seat){
                  if(!seat.seatNumber){
                      Dialog({message: `车位id${seat.pid}未填写车位号！`})
                  }
                  axios.post(`/private/updatePark`,{
                      seat_number: seat.seatNumber,
                      spot: spot.name,
                      pid: seat.pid,
                  }).catch(err => {
                  })
              }
          }
      },
      //增加车位
      addSeat(index){
          console.log('addGoods');
          axios.post(`/private/addSeat`,{spot:this.section[index].name, spot_id:this.section[index].id, pstatus: 2}).then(res => {
              if(res.data.status === 0){
                  this.section[index].seat.push({ pid: res.data.data.pid })
              }
          }).then(res => {
          }).catch(err => {
              console.log(err);
          })
      },
      //获取商品
      getCateAndGoods(){
          axios.get(`/private/getAllPark`).then(res => {
              if(res.data.status === 0){
                let _data = res.data.data;
                console.log(_data);
                _data.forEach((seat,index) => {
                    let temp_section = seat.spot; //保存分类名称
                    let rst = this.section.every((item,index) => {
                        if(item.name === temp_section){
                            item.seat.push({pid: seat.pid, seatNumber:seat.seat_number, seatSpot:seat.spot_id})
                            return false
                        }
                        return true
                    })
                    if(rst){
                        this.section.push({name: seat.spot, id: seat.spot_id ,seat:[{pid: seat.pid, seatNumber:seat.seat_number, seatSpot:seat.spot_id}]})
                    }
                    
                })
              }
          }).catch(err => {

          })
          console.log(this.section);
      },
      //删除商品
      deleteBypid(index1, index2){
          console.log(this.section);
          let pid = this.section[index1].seat[index2].pid;
          axios.delete(`/private/deleteParkByPid?pid=${pid}`).then(res => {
              if(res.data.status === 0){
                  this.section[index1].seat.splice(index2,1);
              }
          })
      },
      //删除地点
      deleteSpot(spot, index){
          axios.delete(`/private/deleteSeatBySpot?spot=${spot}`).then(res => {
              if(res.data.status === 0){
                  this.section[index].goods= []
                  setTimeout(()=>{
                      this.section.splice(index, 1);
                      !this.showIndex?this.showIndex:this.showIndex--;
                  },400)
                  console.log('删除成功');
              }
          })
      }
  },
  components:{
      headTop,
      footGuide,
      [Dialog.Component.name]: Dialog.Component
  },
  activated(){
    
  },
  created(){
      this.getCateAndGoods()
  },
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
    height: 25.2rem;
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
    font-family: Georgia, 'Times New Roman', Times, serif;
    font-weight: bolder;
    font-size: .65rem;
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
    height: 4rem;
    border: 0.0624rem solid #eee;
    line-height: 1.5rem;
    border-bottom: 0.0225px solid rgb(174, 169, 169, .8);
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
    height: 1.4rem;
    width: auto;
    border: 0.025rem solid white;
    padding: 0 0.25rem;
    margin-top: .1rem;
    margin-right: 1.8rem;
    font-size:.65rem;
    color:white;
    border-radius: 0.125rem;
    background-color: rgba(155, 155, 160);
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
