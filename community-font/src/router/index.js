import Vue from 'vue'
import Router from 'vue-router'
import App from '../App'
Vue.use(Router)

export default new Router({
  routes:[
    {
      path: '',
      component: App,
      children: [
        {
          path: '/',
          redirect: '/login'
        },
        {
          path: '/login',
          component: () => import('../pages/login')
        },
        {
          path: '/register',
          component: () => import('../pages/registe')
        },
        {
          path: '/auditList',
          component: () => import('../pages/auditList')
        },
        {
          path: '/mysite',
          component: () => import('../pages/mysite')
        },
        {
          path: '/addShelter',
          component: () => import('../pages/addShelter'),
        },
        {
          path: '/editShop/:id',
          component: () => import('../pages/editShop'),
          props: true
        },
        {
          path: '/pubService/:id/:type',
          component: () => import('../pages/pubService'),
          props: true
        },
        {
          path: '/profile',
          component: () => import('../pages/profile')
        },
        {
          path: '/shopMenu',
          component: () => import('../pages/shopMenu')
        },
        {
          path: '/shopDetail',
          name: 'shopDetail',
          component: () => import('../pages/shopDetail'),
          children: [{
            path: '',
            component: () => import('../components/rate')
          }]
        },
        {
          name: 'comfirmOrder',
          path:'/comfirmOrder',
          component: () => import('../pages/comfirmOrder')
        },
        {
          path:'/park',
          component: () => import('../pages/park'),
        },
        {
          path:'/parkManage',
          component: () => import('../pages/parkManage'),
        },
        {
          path:'/magazine',
          component: () => import('../pages/magazine')
        },
        {
          path:'/magazineManage',
          component: () => import('../pages/magazineManage')
        },
        {
          path: '/notice',
          component: () => import('../pages/notice')
        },
        {
          path: '/myInfo',
          component: () => import('../pages/myInfo')
        },
        {
          path: '/addressEdit',
          component: () => import('../pages/addressEdit')
        },
        {
          path: '/myOrder',
          component: () => import('../pages/myOrder')
        },
        {
          path: '/userManage',
          name: 'userManage',
          component: () => import('../pages/userManage')
        },
        {
          path: '/sellerOrder',
          component: () => import('../pages/sellerOrder')
        },
        {
          path: '/service/:id',
          component: () => import('../pages/service'),
          props: true
        },
        {
          path: '/serviceDetail',
          name: 'serviceDetail',
          component: () => import('../pages/serviceDetail'),
          children: [{
            path: '',
            component: () => import('../components/rate')
          }]
        },
      ]

    }
  ]
})
