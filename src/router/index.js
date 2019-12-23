import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

export default new Router({
  // mode: 'history',
  routes: [
    // {
    //   path: '*',
    //   component: (resolve) => require(['@/tabBar/home'], resolve)
    // },
    {
      path: '/', // paas 普通用户
      name: 'home',
      component: (resolve) => require(['@/tabBar/home'], resolve)
    },
    { // 用户列表
      path: '/userList',
      name: 'userList',
      component: (resolve) => require(['@/pages/user/userList'], resolve)
    },
    { // 上传调试页面
      path: '/upload',
      name: 'upload',
      component: (resolve) => require(['@/pages/user/upload'], resolve)
    }
  ]
})
