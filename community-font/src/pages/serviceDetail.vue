<template>
    <div>
        <head-top :goBack="true" :userinfo="true" :title="'服务详情'"></head-top>
        <van-form style="margin-top: 2rem">
            <van-cell-group inset>
                <van-field
                v-model="shopInfo.shopName"
                name="shopName"
                placeholder="服务名"
                label="服务名"
                autocomplete="off"
                class="form_item"
                :disabled="true"
                :rules="[{ required: true, message: '请填写服务名' }]"
                />
                <van-field
                v-model="shopInfo.contact"
                name="contact"
                placeholder="联系人"
                label="联系人"
                class="form_item"
                autocomplete="off"
                :disabled="true" 
                :rules="[{ required: true, message: '请填写联系人' }]"
                />
                <van-field
                v-model="shopInfo.payway"
                name="contact"
                placeholder="计费方式"
                label="计费方式"
                class="form_item"
                :disabled="true"
                autocomplete="off" 
                :rules="[{ required: true, message: '计费方式' }]"
                />
                <van-field
                v-model="shopInfo.phone"
                name="phone"
                label="联系电话"
                placeholder="联系电话"
                :disabled="true"
                class="form_item"
                autocomplete="off" 
                :rules="[{ required: true, message: '请填写联系电话' }]"
                />
                <!-- <van-field
                v-model="shopInfo.content"
                name="content"
                label="服务内容"
                placeholder="服务内容"
                :disabled="true"
                class="form_item"
                style="height:3rem"
                autocomplete="off" 
                type="textarea"
                :rules="[{ required: true, message: '请填写服务内容' }]"
                /> -->
                <!-- <van-field name="license" label="服务图片" class="form_item" :rules="[{ required: true, message: '请上传服务图片' }]">
                    <template #input>
                        <van-uploader v-model="shopInfo.shopPic" :max-count="1" preview-size="110"  :deletable='false' />
                    </template>
                </van-field> -->
            </van-cell-group>
             <el-table border
                :data="serviceProject"
                style="width:100%;padding-left:.2rem">
                <el-table-column
                    prop="project"
                    label="服务项目"
                    width="150">
                </el-table-column>
                <el-table-column
                    prop="price"
                    label="价格(￥)"
                    width="220">
                </el-table-column>
            </el-table>
            
            <el-button block type="primary" style="margin-left:.6rem" @click="beginOrderPop = true">
                下单
            </el-button>
        </van-form>
        <div style="margin-left:.8rem;font-size:.65rem;">评论区</div>
        <router-view :serve_id="$route.query.id"></router-view>
          <!-- 弹出层 -->
        <van-popup v-model="beginOrderPop" position="bottom" :style="{ height: '50%' }" >
            <van-form>
                <van-cell-group inset>
                    <van-field
                    v-model="ocontent"
                    name="shopName"
                    placeholder="请填写订单内容"
                    label-width="5rem"
                    class="form_item"
                    autocomplete="off" 
                    type="textarea"
                    rows="3"
                    :rules="[{ required: true }]"
                    />
                </van-cell-group>
                <section class="address">
                    <svg class="location_icon">
                        <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#location"></use>
                    </svg>
                    <div class="add_address" v-if="!choosedAddress" @click="bottomPopup=true">请添加服务地址</div>
                    <div class="address_show" v-else >
                        <div style="width:82%">
                        <div class="address_item">
                            <span>{{(chosenIndex!=undefined && chosenIndex!=null && addrlist[chosenIndex].name)||undefined}}</span>
                            <span>{{(chosenIndex!=undefined && chosenIndex!=null && addrlist[chosenIndex].tel)||undefined}}</span>
                        </div>
                        <div class="address_item">
                            {{(chosenIndex!=undefined && chosenIndex!=null && addrlist[chosenIndex].address)||undefined}}
                        </div>
                        </div>
                        <van-icon name="edit" style="margin-top: 1rem" @click="bottomPopup=true"/>
                    </div>
                </section>
                <div style="margin: 16px;">
                    <van-button round block type="primary" @click='orderBegin'>
                    确定
                    </van-button>
                </div>
            </van-form>
        </van-popup>

        <van-popup v-model="bottomPopup" position="bottom" :style="{ height: '60%',overflow: 'scroll' }" >
        <van-address-list
            v-model="chosenAddressId"
            :list="addrlist"
            default-tag-text="默认"
            @add="onAdd"
            @edit="onEdit"
            @select="onSelect"
        >
            <template #default>
            </template>
        </van-address-list>
    </van-popup>
    </div>
</template>

<script>
import axios from 'axios'
import headTop from '../components/head.vue'
import { Toast } from 'vant'
import config from '@/../myConfig'
import { mapState,mapActions } from 'vuex'
import dayjs from 'dayjs'
export default {
    components:{
        headTop
    },
    data() {
        return {
            bottomPopup: false,
            chosenAddressId: null,
            chosenIndex: null,
            addrlist:[],
            serviceProject:[],
            beginOrderPop: false,
            shopInfo: {
                shopName: null,
                phone: null,
                contact: null,
                content: null,
                shopPic: [],
                payway: null,
                serve_type: null
            },
            ocontent: null,
            choosedAddress: null
        }
    },
    methods: {
        ...mapActions(['setPayState']),
        getServiceById(){
            axios.get(`/private/getServiceById?id=${this.$route.query.id}`).then(res => {
                if(res.data.status === 0){
                    console.log(res.data);
                    let data = res.data.data
                    this.shopInfo.shopName = data.shop_name;
                    this.shopInfo.phone = data.phone;
                    this.shopInfo.contact = data.contact;
                    this.shopInfo.content = JSON.parse(data.content);
                    this.serviceProject = JSON.parse(data.content)
                    this.shopInfo.payway = data.payway;
                    this.shopInfo.serve_type = data.serve_type
                    if(data.shop_pic){
                        this.shopInfo.shopPic = [{
                            url: config.serverIp + data.shop_pic
                        }]
                    }
                }
            }).catch(err => {

            })
        },
        orderBegin(){
            this.insertOrder()
        },
        insertOrder(){
            if(!this.ocontent) return 
            let buyerInfo = {name: this.addrlist[this.chosenIndex].name, phone:this.addrlist[this.chosenIndex].tel, address: this.addrlist[this.chosenIndex].address}
            axios.post(`/private/insertOrder`,{
                serve_id: this.$route.query.id,
                uid: this.userInfo.uid,
                ocontent: this.ocontent,
                otime: dayjs(new Date()).locale('zh-cn').format('YYYY-MM-DD hh:mm:ss'),
                ostatus: 1,
                type: this.shopInfo.serve_type,
                buyer_info: JSON.stringify(buyerInfo),
                seller_status: 1
            }).then(res => {
                if(res.data.status === 0){
                    Toast({message: '下单成功'})
                }
            })
        },
        getAddr(){
            axios.get(`/private/getAddr?uid=${this.userInfo.uid}`).then(res => {
                if (res.data.status === 0) {
                    let data = res.data.data;
                    data.forEach((item,index) => {
                        if(item.isDefault === 1) {
                        this.chosenAddressId = item.aid
                        this.chosenIndex = index
                        }
                        this.addrlist.push({
                        type: 'update',
                        id: item.aid,
                        name: item.name,
                        tel: item.phone,
                        address: item.detailaddr,
                        isDefault: item.isDefault 
                        })
                    })
                    // 如果没有选中的地址，则需要选中地址
                    if(!this.chosenAddressId){
                        this.choosedAddress = true
                    }
                }
            })
        },
        onAdd(){
            this.$router.push({path: '/addressEdit', query:{
                type: 'insert'
            }})
        },
        onEdit(content){
            this.$router.push({path: '/addressEdit',query:{
                type: 'update',
                aid: content.id,
                addressDetail: content.address,
                name: content.name,
                tel: content.tel
            }})
        },
        onSelect(content, index){
            this.chosenIndex = index
        },
    },
    activated(){
        this.getServiceById()
        // 从编辑地址进入订单页面所做的初始化
        this.chosenIndex = 0
        this.addrlist = []
        this.getAddr()
    },
    computed:{
        ...mapState(['userInfo', 'payState'])
    },
    
    // watch:{
    //     id: function(){
    //         this.shopInfo = []
    //         this.getServiceById()
    //     }
    // }
}
</script>

<style lang="css">
.address{
    position: relative;
    width: 90%;
    height: 3rem;
    padding-left: .4rem;
    margin-top: 2rem;
    line-height: 3rem;
    border-bottom: .0225rem solid rgb(231, 228, 228, .8);
}
.address_item{
  height: 1rem;
  font-size: .60rem;
}
.add_address{
  float: right;
  width: 90%;
  height: 2.4rem;
  line-height: 2.4rem;
}
.address_show{
  display: flex;
  /* align-items: center; */
  float: right;
  width: 90%;
  height: 2rem;
  line-height: 2rem;
}
.location_icon{
  position: absolute;
  top: 1rem;
  display: inline-block;
  width: .8rem;
  height: .6rem;
  fill: blue;
}
</style>