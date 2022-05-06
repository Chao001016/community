<template>
<div>
    <head-top :goBack="true" :title="'我的信息'"></head-top>
    <van-form @submit="onSubmit" style="margin-top: 2rem">
        <van-cell-group inset>
            <van-field
            v-model="userinfo.nickName"
            name="用户名"
            label="用户名"
            placeholder="用户名"
            autocomplete="off" 
            
            />
            
            <van-field
            v-model="userinfo.address"
            name="地址"
            label="地址"
            placeholder="请选择地址"
            is-link
            readonly
            @click="showAddresPicker = true"
            />
            <van-field
            v-model="userinfo.email"
            name="邮箱"
            label="邮箱"
            placeholder="邮箱"
            autocomplete="off" 
            />
            <van-field
            v-model="userinfo.phone"
            name="phone"
            label="电话"
            placeholder="电话"
            autocomplete="off" 
            />
            <van-field name="radio" label="单选框">
            <template #input>
                <van-radio-group v-model="userinfo.sex" direction="horizontal">
                <van-radio name="1" value="0">男</van-radio>
                <van-radio name="2" value="1">女</van-radio>
                </van-radio-group>
            </template>
            </van-field>
            <van-field name="uploader" label="头像">
                <template #input>
                    <label for="userPic">
                        <img :src="userPic" alt="" style="width:3.4rem;height:3.4rem" v-if="userPic">
                    </label>
                    <van-uploader v-model="userinfo.userPic" :max-count="1" id="userPic" :after-read="afterRead" v-show="!userPic"/>
                </template>
            </van-field>
        </van-cell-group>
        <div style="margin: 16px;">
            <van-button round block type="primary" native-type="submit">
            保存
            </van-button>
        </div>
    </van-form>
    <van-popup v-model="showAddresPicker" position="bottom" ref="typePopup">
        <van-picker
            :columns="addressColumn"
            @confirm="onAddressConfirm"
            :show-toolbar="true"
            @cancel="showAddresPicker = false"
        />
    </van-popup>
</div>
</template>

<script>
import headTop from '../components/head.vue'
import { Form, Field, CellGroup, Button, Uploader, RadioGroup, Radio, Toast  } from 'vant'
import axios from 'axios'
import { mapState } from 'vuex'
import config from '@/../myConfig'
export default {
  components: {
    [Form.name]: Form,
    [Field.name]: Field,
    [CellGroup.name]: CellGroup,
    [Button.name]: Button,
    [Uploader.name]: Uploader,
    [RadioGroup.name]: RadioGroup,
    [Radio.name]: Radio,
    headTop
  },
  data () {
    return {
        showAddresPicker: false,
        addressColumn: [{text:'1栋',children:[{text:'101'},{text:'102'},{text:'201'},{text:'202'}]},
                        {text:'2栋',children:[{text:'101'},{text:'102'}]}],
        userinfo: {
            nickName: null,
            sex: null,
            email: null,
            phone: null,
            address: null,
            userPic: [] // 上传时的头像
        },
        userPic: null // 默认头像
    }
  },
  methods: {
      onSubmit () {
          let formdata = new FormData()
          let _file = this.userinfo.userPic&&this.userinfo.userPic[0]&&this.userinfo.userPic[0].file
          formdata.append('file', _file)
          formdata.append('uid', this.userInfo.uid)
          formdata.append('nickname', this.userinfo.nickName)
          formdata.append('sex', this.userinfo.sex)
          formdata.append('phone', this.userinfo.phone)
          formdata.append('email', this.userinfo.email)
          formdata.append('address', this.userinfo.address)
          axios.post(`/public/account/updateUserInfo`,formdata).then(res => {
              if(res.data.status === 0) {
                  Toast({message: "保存成功"})
              }
          })
      },
      getUserInfo () {
          axios.get(`/public/account/getUserInfo?uid=${this.userInfo.uid}`).then(res => {
              if(res.data.status === 0) {
                  let _data = res.data.data
                  this.userinfo.nickName = _data.nickname
                  this.userinfo.sex = _data.sex
                  this.userinfo.email = _data.email
                  this.userinfo.address = _data.address
                  this.userinfo.phone = _data.phone
                  this.userPic = _data.user_pic? config.serverIp + _data.user_pic: null   
              }
          })
      },
      afterRead () {
          this.userPic = null
      },
      onAddressConfirm(value){

      }
  },
  computed: {
      ...mapState(['userInfo'])
  },
  
  mounted() {
      this.getUserInfo()
  }
}
</script>

<style scoped>
#userPic{
    width: 3rem;
    height: 3rem;
}
</style>
