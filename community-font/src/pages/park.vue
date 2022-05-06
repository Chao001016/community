<template>
  <div>
    <head-top :goBack="true" :userinfo="true"></head-top>
    <!-- 筛选条件 -->
    <div class="pick">
      <van-popover v-model="statePop" :actions="stateAction" @select="onStateSelect">
        <template #reference>
          <el-button type="primary" size="small" @click="statePop=!statePop">状态筛选</el-button>
        </template>
      </van-popover>
      <el-button type="primary" size="small" @click="carPop=!carPop">我的车位</el-button>
    </div>

    <div id="article">
    <van-index-bar :index-list="indexList" class="index_bar" @scroll="getParkByPage">
      <div v-for="(item,index1) in indexList" :key="index1" class="outercontainer">
          <van-index-anchor :index="item" :id="'spot'+index1">地点:{{item}}</van-index-anchor>
          <van-cell v-for="(seat,index2) in park" :key="index2" v-show="seat.spot === item" class="innercontainer">
              <van-field
              v-model="seat.seat_number"
              name="车位号"
              label="车位号"
              class="_vanfiedl"
              disabled
              />
              <van-field
              v-model="seat.status"
              name="状态"
              label="状态"
              class="_vanfiedl"
              disabled
              />
              <van-field
              v-model="seat.start_date"
              name="起始时间"
              label="起始时间"
              class="_vanfiedl"
              disabled
              v-if="seat.pstatus === 1"
              />
              <van-field
              v-model="seat.end_date"
              name="截止时间"
              label="截止时间"
              class="_vanfiedl"
              disabled
              v-if="seat.pstatus === 1"
              />
              <van-button color="blue" size="small" style="width:3rem" @click="subscribe(index2)" v-if="seat.pstatus !== 1">预定</van-button>
          </van-cell>
      </div>
    </van-index-bar>
    </div>
  
    <!-- 弹出组件 -->
    <van-dialog v-model="dialogAlert" title="预定时间" show-cancel-button @confirm="confirmSubscribe()">
        <div style="margin-top:1rem">
           <div style="line-height:2rem">
                <van-button color="blue" style="margin-left:.8rem;width:5.2rem;font-size:.62rem" @click="start_pick_show = true">选择起始时间</van-button>
                <span style="margin-left:.5rem">{{fomrateStart}}</span>
           </div>
           <div style="line-height:2rem">
                <van-button color="blue" style="margin-left:.8rem;width:5.2rem;margin-top:1rem;font-size:.62rem" @click="end_pick_show = true">选择终止时间</van-button>
                <span style="margin-left:.5rem">{{fomrateEnd}}</span>
           </div>
        </div>
    </van-dialog>
    <van-datetime-picker v-show="start_pick_show"
    style="position:fixed;top:6rem;z-index:3004;left:3rem;width:10rem;height:13rem;border-radius: 4px;border:1px solid black;"
    v-model="start_time"
    @confirm='timeConfirm'
    type="datehour"
    title="选择起始时间"
    :min-date="minDate"
    />
    <van-datetime-picker v-show="end_pick_show"
    style="position:fixed;top:6rem;z-index:3004;left:3rem;width:10rem;height:13rem;border-radius: 4px;border:1px solid black;"
    @confirm='timeConfirm'
    v-model="end_time"
    type="datehour"
    title="选择终止时间"
    :min-date="minDate"
    />
    <van-popup v-model="carPop" position="top" :style="{ minHeight: '4rem' }">
      <van-empty description="暂未预定车位" v-if="!mySeat">
      </van-empty>
      <div style="font-size:.7rem;font-weight:800" v-else>
        <div style="margin: .5rem 2rem"><em>车位号</em> : {{mySeat.seat_number}}</div>
        <div style="margin: .5rem 2rem"><em>截止时间</em> : {{mySeat.end_date}}</div>
        <div style="margin: .5rem 2rem"><el-button type="primary" size="mini" @click="releaseSeat(mySeat.pid, () => $toast({message: '释放成功'}))">释放车位</el-button></div>
      </div>
    </van-popup>
    <van-loading class="load" size="2rem" type="spinner" v-show="loading">
    </van-loading>
  </div>
</template>

<script>
import Vue from 'vue'
import headTop from "../components/head.vue";
import { mapState } from "vuex";
import axios from "axios";
import { IndexBar, IndexAnchor, Cell ,Field ,Button, Dialog, DatetimePicker, Popup, Toast } from 'vant';
import dayjs from 'dayjs'
import { Popover } from 'vant';
var that = {}
export default {
  components: {
    [IndexBar.name]: IndexBar,
    [IndexAnchor.name]: IndexAnchor,
    [Cell.name]: Cell,
    [Field.name]: Field,
    [Button.name]: Button,
    [Dialog.Component.name]: Dialog.Component,
    [DatetimePicker.name]: DatetimePicker,
    [Popover.name]: Popover,
    [Popup.name]: Popup,
    headTop
  },
  data() {
    return {
      carPop: false,
      statePop: false,
      dialogVisible: false,
      seatIndex: "",
      start_time: "",
      dialogAlert: false,
      end_time: "",
      start_pick_show: false,
      end_pick_show: false,
      dialogShow: false,
      loading: true,
      indexList: [],
      park:[
          // {pid:1,seat_number:1,start_time:'',end_time:'',spot:'天马',status:0},
          // {pid:5,seat_number:5,start_time:'',end_time:'',spot:'天马',status:0},
          // {pid:6,seat_number:6,start_time:'',end_time:'',spot:'天马',status:0},
          // {pid:7,seat_number:7,start_time:'',end_time:'',spot:'天马',status:0},
          // {pid:8,seat_number:8,start_time:'',end_time:'',spot:'天马',status:0},
          // {pid:9,seat_number:9,start_time:'',end_time:'',spot:'天马',status:0},
          // {pid:10,seat_number:2,start_time:'',end_time:'',spot:'德智',status:0},
          // {pid:11,seat_number:2,start_time:'',end_time:'',spot:'德智',status:0},
          // {pid:12,seat_number:2,start_time:'',end_time:'',spot:'德智',status:0},
          // {pid:13,seat_number:2,start_time:'',end_time:'',spot:'德智',status:0},
          // {pid:14,seat_number:2,start_time:'',end_time:'',spot:'德智',status:0},
          // {pid:15,seat_number:2,start_time:'',end_time:'',spot:'德智',status:0},
          // {pid:2,seat_number:2,start_time:'',end_time:'',spot:'德智',status:0},
          // {pid:3,seat_number:3,start_time:'',end_time:'',spot:'二里半',status:0},
          // {pid:16,seat_number:3,start_time:'',end_time:'',spot:'二里半',status:0},
          // {pid:17,seat_number:3,start_time:'',end_time:'',spot:'二里半',status:0},
          // {pid:18,seat_number:3,start_time:'',end_time:'',spot:'二里半',status:0},
          // {pid:19,seat_number:3,start_time:'',end_time:'',spot:'二里半',status:0},
          // {pid:20,seat_number:3,start_time:'',end_time:'',spot:'二里半',status:0},
          // {pid:21,seat_number:3,start_time:'',end_time:'',spot:'二里半',status:0},
          // {pid:23,seat_number:4,start_time:'',end_time:'',spot:'咸嘉湖',status:0},
          // {pid:24,seat_number:4,start_time:'',end_time:'',spot:'咸嘉湖',status:0},
          // {pid:25,seat_number:4,start_time:'',end_time:'',spot:'咸嘉湖',status:0},
          // {pid:26,seat_number:4,start_time:'',end_time:'',spot:'咸嘉湖',status:0},
          // {pid:27,seat_number:4,start_time:'',end_time:'',spot:'咸嘉湖',status:0},
          // {pid:28,seat_number:4,start_time:'',end_time:'',spot:'咸嘉湖',status:0},
          // {pid:22,seat_number:4,start_time:'',end_time:'',spot:'咸嘉湖',status:0},
      ],
      orgIndexList: [], // 保存初始数据
      orgPark: [],  // 保存初始数据
      minDate: new Date(),
      stateAction: [
        { text: '空闲' },
        { text: '被占用' },
        { text: '预定中' },
      ],
      page: 1,
      size: 5,
      totalPage: null,
      mySeat: null
    }
  },
  methods: {
    subscribe(index) {
      if (!this.mySeat) {
        this.seatIndex = index
        this.dialogAlert = true
      } else {
        Toast({message: '只能拥有一个车位'})
      }
    },
    confirmSubscribe() {
      console.log('confirmSubscribe');
      this.dialogVisible = false;
      axios.post(`/private/updatePStatus`, {
          uid: this.userInfo.uid,
          pid: this.park[this.seatIndex].pid,
          start_date: dayjs(new Date(this.start_time)).locale('zh-cn').format('YYYY-MM-DD HH:00'),
          end_date: dayjs(new Date(this.end_time)).locale('zh-cn').format('YYYY-MM-DD HH:00'),
          pstatus: 1,
        })
        .then((res) => {
          if (res.data.status === 0) {
            this.clearAndGet()
            this.getMySeat()
            Dialog({message: '预定成功'})
          }
          else if(res.data.status === 3){
            Dialog({message: '车位已被占用'})
            this.clearAndGet()
            this.getMySeat()
          }
        });
    },
    getParkByPage () {
      if(document.documentElement.scrollHeight - 20 < document.documentElement.scrollTop + document.documentElement.clientHeight) {
          if(this.page <= this.totalPage) {
              that._getParkByPage()
          }
      }
    },
    async getPark() {
      await axios.get(`/private/getPark?page=${this.page}&size=${this.size}`).then((res) => {
        if (res.data.status === 0) {
          let _data = res.data.data
          this.totalPage = _data.totalPage
          this.page++
          res.data.data.data.forEach(item => {
            this.$set(item, 'status', '')
            if(!this.indexList.includes(item.spot)){
                this.indexList.push(item.spot)
            }
            if(item.pstatus === 0){
                item.status = '预定中'
            }
            else if(item.pstatus === 1){
                // 检验是否过期
                if(this.isOverDate(item.end_date)) {
                  console.log(122);
                  item.status = '空闲'
                  this.releaseSeat(item.pid)
                }
                else item.status = '被占用'
            }
            else {
                item.status = '空闲'
            }
            this.park.push(item)
            this.loading = false
          })
          this.orgIndexList = [...this.indexList]
          this.orgPark = [...this.park]
        }
      });
    },
    timeConfirm(value){
        console.log(value);
        this.start_pick_show = false
        this.end_pick_show = false
    },
    onStateSelect(action){
      this.indexList = []
      if(action.text === '空闲') {
        this.park = this.orgPark.filter(item => {
          return item.pstatus === 2
        })
      } else if (action.text === '被占用') {
        this.park = this.orgPark.filter(item => {
          return item.pstatus === 1
        })
      } else {
         this.park = this.orgPark.filter(item => {
           return item.pstatus === 0
        })
      }
      this.park.forEach(item => {
        if(!this.indexList.includes(item.spot)){
            this.indexList.push(item.spot)
        }
      })
    },
    getMySeat(){
      axios.get(`/private/getMySeat?uid=${this.userInfo.uid}`).then(res => {
        if (res.data.status === 0) {
          let _data = res.data.data
          this.mySeat = _data
        }
      })
    },
    isOverDate(endTime){
      return Date.now() >= new Date(endTime).getTime()
    },
    releaseSeat(pid, callback){
      axios.post(`/private/updatePStatus`, {  
        pstatus: 2,
        pid
      }).then(res => {
        if(res.data.status === 0) {
          callback&&callback(res)
          this.getMySeat()
          this.clearAndGet()
        }
      })
    },
    clearAndGet(){
      this.park = []
      this.page = 1
      this.orgIndexList = []
      this.orgPark = []
      this.getPark()
    }
  },
  activated(){
    this.clearAndGet()
    this.getMySeat()
  },
  mounted(){
    window.onscroll = () => {
      this.getParkByPage()
    }
  },
  created() {
    that._getParkByPage = this._.throttle(this.getPark, 500, {leading: false})
  },
  computed: {
    ...mapState(["userInfo"]),
    fomrateStart(){
      return  dayjs(new Date(this.start_time)).locale('zh-cn').format('YYYY-MM-DD HH:00')
    },
    fomrateEnd(){
        return  dayjs(new Date(this.end_time)).locale('zh-cn').format('YYYY-MM-DD HH:00')
    }
  },
  props:['']
};
</script>

<style>
#article{
  min-height: 20rem;
}
.pick{
  width: 100%;
  height: 2rem;
  border-bottom: 1px solid rgb(231, 230, 230);
  padding: 0 .6rem;
  margin-top: 2rem;
  line-height: 2rem;
}
._vanfiedl{
  background-color: rgba(186, 217, 240, 0.4);
  
}
.load{
    position: absolute;
    left: 7rem;
    top: 10rem;
}
.index_bar .van-field__label{
    color: black;
}
.index_bar .van-field__control{
    -webkit-text-fill-color: black;
    color: black;
}
.van-index-bar__sidebar span{
    display: inline-block;
    height: 1rem;
}
.van-index-anchor{
    font-weight: bolder;
}
.seat_item {
  width: 12rem;
  border-bottom: 1px solid rgb(204, 201, 201, 0.4);
  overflow: hidden;
}
.el-dialog__body {
  height: 8rem;
}
.dialog-footer {
  position: absolute;
  width: 100%;
  height: 2rem;
  left: -2rem;
  top: 10rem;
}
.van-index-bar__index{
  /* color: blue; */
  font-weight: 700;
}
.slide-left-enter-active {
  transition: all .3s ease;
}
.slide-left-leave-active {
  transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-left-enter, .slide-left-leave-to
/* .slide-fade-leave-active for below version 2.1.8 */ {
  /* transform: translateY(25rem); */
}
</style>
