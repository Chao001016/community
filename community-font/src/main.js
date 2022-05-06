// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'
import router from './router'
import axios from 'axios'
import init from '../static/js/init'
import store from './store/index'
import VueScrollTo from "vue-scrollto"
import ElementUI from 'element-ui';
import { Loading, Dialog, Toast, Icon, Empty, Button, DropdownMenu, DropdownItem, Popup, Picker, Uploader, Field, Form, CellGroup, AddressList,Popover } from 'vant';
import config from '@/../myConfig'
import _ from 'lodash'
Vue.use(Popover);
Vue.use(AddressList);
Vue.use(CellGroup); 
Vue.use(Toast);
Vue.use(Form);
Vue.use(Field);
Vue.use(Popup);
Vue.use(Uploader);
Vue.use(Picker);
Vue.use(Loading)
Vue.use(Dialog.Component)
Vue.use(Icon)
Vue.use(Empty)
Vue.use(Button)
Vue.use(DropdownMenu)
Vue.use(DropdownItem)

Vue.use(Vuex)
Vue.use(init)
Vue.config.productionTip = false
Vue.use(VueScrollTo,{
     container: "body",
     duration: 500,
     easing: "ease",
     offset: 0,
     force: true,
     cancelable: true,
     onStart: false,
     onDone: false,
     onCancel: false,
     x: false,
     y: true
 })
Vue.use(ElementUI)

//

// 引入 socket.io
import VueSocketIO from 'vue-socket.io';
import SocketIO from 'socket.io-client';
// 使用 socket.io
Vue.use(new VueSocketIO({
  debug: true,
  connection: SocketIO("http://172.19.160.71:3000"), //xxx填后台给的socket地址，端口号根据实际后台端口写
  vuex: {
    store,
    mutationPrefix: "SOCKET_",
    actionPrefix: "SOCKET_"
  }
}));
new Vue({
  store,
  el: '#app',
  router,
  components: { App },
  beforeCreate(){
    Vue.prototype._ = _
    Vue.prototype.$bus = this
    axios.interceptors.request.use(
      req => {
        if(/\/private/g.test(req.url)){
          if (localStorage.token) {  // 判断是否存在token，如果存在的话，则每个http header都加上token
            req.url = config.serverIp + req.url
            req.headers['authorization'] = localStorage.token;
          }
          else this.$router.push({path: '/login'})
          return req
        }
        if(/\/public/g.test(req.url)){
          console.log(req.url);
          req.url = config.serverIp + req.url;
        }
        return req;
    })
    axios.interceptors.response.use(res => {
      if(res.data.status === 2){//token失效重新登录
        this.$router.push({path: '/login'})
      }
      return res
    })
  },
  
  template: '<App/>'
})
