<template>
  <div>
    <head-top :goBack="true" :title="'注册'"></head-top>
    <van-form style="margin-top: 2rem" ref="registForm">
      <van-cell-group inset>
          <van-field
          v-model="registeForm.userType"
          name="userType"
          :rules="[{ required: true, message: '请选择用户类型' }]"
          label="用户类型">
            <template #input>
              <van-radio-group v-model="registeForm.userType" direction="horizontal">
                <van-radio name="0" value="0">居民</van-radio>
                <van-radio name="1" value="1">商家</van-radio>
              </van-radio-group>
            </template>
          </van-field>
          <van-field
          v-model="registeForm.account"
          name="account"
          label="账号"
          :autocomplete="'off'"
          :rules="[{ required: true, validator: validateAccount, message: '账号为6-12位的数字' }]"
          />
          <van-field
          type="password"
          v-model="registeForm.password"
          name="password"
          label="密码"
          :autocomplete="'off'"
          :rules="[{ required: true, validator: validatePassword, message: '密码必须包含数字和大小写字母,共计6-12位' }]"
          />
          <van-field
          type="password"
          v-model="registeForm.confirmPassowrd"
          name="confirmPassword"
          label="确认密码"
          :rules="[{ required: true, message: '请确认密码' }]"
          :autocomplete="'off'"
          />
      </van-cell-group>
      <div style="margin: 16px;">
          <van-button round block type="primary" size="small" @click="registe">
          注册
          </van-button>
      </div>
    </van-form>
  </div>
  
</template>

<script>
import axios from 'axios'
import headTop from '../components/head.vue'
import { Form, Field, CellGroup, Button, Uploader, RadioGroup, Radio, Toast  } from 'vant'
import config from '../../myConfig'
export default {
  data(){
    return {
      registeForm:{
        account: "",
        password: "",
        confirmPassowrd: "", //确认密码
        userType: ""
      }
      
    }
  },
  methods:{
    validateAccount(val){
      //账号要为6-12位的数字
      return /^\d{1,12}$/g.test(val)
    },
    validatePassword(val){
      //密码必须包含数字和字母,共计6-12位
      return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{1,12}$/g.test(val)
    },
    registe(){
      this.$refs['registForm'].validate().then(res=>{
        console.log(this.registeForm.password,this.registeForm.confirmPassowrd);
        if(this.registeForm.password !== this.registeForm.confirmPassowrd) {
          Toast({message: '确认密码不一致'})
        }
        else {
          axios.post('/public/account/registe',{
            account: this.registeForm.account,
            password: this.registeForm.password,
            userType: this.registeForm.userType
          }).then(res => {
            if(res.data.status === 0){
              Toast('注册成功')
            }
          })
        }
      },res=>{

      })
      
    }
  },
  mounted() {
      console.log('login')
  },
  components:{
    [Form.name]: Form,
    [Field.name]: Field,
    [CellGroup.name]: CellGroup,
    [Button.name]: Button,
    [Uploader.name]: Uploader,
    [RadioGroup.name]: RadioGroup,
    [Radio.name]: Radio,
    [Toast.name]: Toast,
    headTop
  }
}
</script>

<style scoped>
.registe{
  width: 100%;
  height: auto;
  margin-top: 3rem;
  font-size: 0.75rem;
  overflow-x: hidden;
}
.registe label{
  display: inline-block;
  width: 3.7rem;
  height: 1rem;
  text-align: left;
  margin-right: 0.3rem;
}
.lable-radios{
  width: 100%;
}
.lable-radios input{ 
  margin-left: 0.55rem;
}
.lable-radios,.lable-input{
  margin: 1.75rem 0 0 1rem;
}
.registe .lable-input label{
  text-align: left;
}
.registe :nth-child(1){
  margin-top: 0;
}
.lable-input input{
  display: inline-block;
  width: 12rem;
  height: 2rem;
  padding-left: 0.8rem;
  box-sizing: border-box;
}
.button-flex{
  margin: 1.75rem 0 0 1rem;
}
.button-flex input{
  width: 4rem;
  height: 2rem;
  display: flex;
  justify-content: space-around;
  letter-spacing: 0.25rem;
  font-size: 0.9rem;
}
</style>