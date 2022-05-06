<template>
  <div>
    <head-top :title="'小区服务平台'"></head-top>
    <van-form style="margin-top: 2rem">
      <van-cell-group inset>
          <van-field
          v-model="loginForm.account"
          name="account"
          label="账号"
          placeholder="账号"
          :autocomplete="'off'"
          />
          <van-field
          type="password"
          v-model="loginForm.password"
          name="password"
          label="密码"
          placeholder="密码"
          :autocomplete="'off'"
          />
      </van-cell-group>
      <div style="margin: 16px;">
          <van-button round block type="primary" size="small" @click="toMySite">
          登录
          </van-button>
          <div style="margin-top:.8rem"></div>
          <van-button round block type="primary" size="small" @click='toRegister'>
          注册
          </van-button>
      </div>
    </van-form>
  </div>
  
</template>

<script>
import axios from 'axios';
import headTop from '../components/head.vue'
import { Form, Field, CellGroup, Button, Uploader, RadioGroup, Radio, Toast  } from 'vant'
import { mapActions } from 'vuex'
export default {
  components:{
    [Form.name]: Form,
    [Field.name]: Field,
    [CellGroup.name]: CellGroup,
    [Button.name]: Button,
    [Uploader.name]: Uploader,
    [RadioGroup.name]: RadioGroup,
    [Radio.name]: Radio,
    headTop
  },
  data(){
    return {
      loginForm:{
        account: '',
        password: '',
      }
    }
  },
  methods:{
    ...mapActions(['setUserInfo']),
    toRegister(){
      this.$router.push({path:'/register'})
    },
    async toMySite(){
      // this.$router.push({path:'/mysite'})
      try {
        let res = await axios.post(`/public/account/login`,{
        account: this.loginForm.account,
        password: this.loginForm.password
      })
      this.setUserInfo(res.data.message);
      if(res && res.data && res.data.status === 0){
        localStorage.setItem('token',res.data.token);
        (res.data.status === 0 || res.data.status === 2 )&& this.$router.replace({path:'/mysite'});
      }
      else {
        Toast('账号或密码错误')
      }
      } catch (error) {
        
      }
    }
  },
  mounted() {
      console.log('login')
  },
}
</script>

<style scoped>
.login{
  width: 100%;
  height: auto;
  margin-top: 6rem;
}
.lable-radios,.lable-input{
  margin: 3rem 0 0 1rem;
}
.lable-radios input{ 
  margin-left: 0.25rem;
}
.lable-input input{
  width: 14rem;
  height: 2rem;
  padding-left: 0.8rem;
  box-sizing: border-box;
}
.lable-input label{
  font-weight: 500;
}
.button-flex{
  display: flex;
  justify-content: space-around;
  margin-top: 2rem;
}
.button-flex input{
  width: 4rem;
  height: 2rem;
  border: 1px solid rgba(0,0,0,0.3);
  border-radius: 4px;
  font-size: 1.1rem;
}
</style>