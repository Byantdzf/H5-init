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
    {
      path: '/community', // community 社群用户
      name: 'communityHome',
      component: (resolve) => require(['@/tabBar/community'], resolve)
    },
    {
      path: '/plaza', // plaza 广场
      name: 'plaza',
      component: (resolve) => require(['@/tabBar/plaza'], resolve)
    },
    {
      path: '/activity',
      name: 'activity',
      component: (resolve) => require(['@/tabBar/activity'], resolve)
    },
    {
      path: '/chitchat',
      name: 'chitchat',
      component: (resolve) => require(['@/tabBar/chitchat'], resolve)
    },
    {
      path: '/user',
      name: 'user',
      component: (resolve) => require(['@/tabBar/user'], resolve)
    },
    {
      path: '/register',
      name: 'register',
      component: (resolve) => require(['@/pages/register'], resolve)
    },
    {
      path: '/login',
      name: 'login',
      component: (resolve) => require(['@/pages/login'], resolve)
    },
    {
      path: '/matching',
      name: 'matching',
      component: (resolve) => require(['@/tabBar/matching'], resolve)
    },
    {
      path: '/personalData',
      meta: {
        keepAlive: true // 需要被缓存
      },
      name: 'personalData',
      component: (resolve) => require(['@/pages/information/personalData'], resolve)
    },
    {
      path: '/map',
      meta: {
        keepAlive: true // 需要被缓存
      },
      name: 'map',
      component: (resolve) => require(['@/pages/map/detail'], resolve)
    },
    {
      path: '/marriageData',
      name: 'marriageData',
      meta: {
        keepAlive: true // 需要被缓存
      },
      component: (resolve) => require(['@/pages/information/marriageData'], resolve)
    },
    {
      path: '/singleData',
      name: 'singleData',
      meta: {
        keepAlive: true// 需要被缓存
      },
      component: (resolve) => require(['@/pages/information/singleData'], resolve)
    },
    { // 编辑资料
      path: '/textareaData',
      name: 'textareaData',
      component: (resolve) => require(['@/pages/information/textareaData'], resolve)
    },
    {
      path: '/authentication', // 实名认证
      name: 'authentication',
      component: (resolve) => require(['@/pages/user/authentication'], resolve)
    },
    {
      path: '/myCommunity', // 群组
      name: 'myCommunity',
      meta: {
        keepAlive: false // 需要被缓存
      },
      component: (resolve) => require(['@/pages/user/myCommunity'], resolve)
    },
    {
      path: '/myCommunityV2', // 我的群组
      name: 'myCommunityV2',
      component: (resolve) => require(['@/pages/user/myCommunityV2'], resolve)
    },
    {
      path: '/communityMember', // 群组成员
      name: 'communityMember',
      component: (resolve) => require(['@/pages/community/member'], resolve)
    },
    {
      path: '/setting', // 设置
      name: 'setting',
      component: (resolve) => require(['@/pages/user/setting'], resolve)
    },
    {
      path: '/createCommunity/:id', // 创建群and修改
      name: 'createCommunity',
      component: (resolve) => require(['@/pages/community/createCommunity'], resolve)
    },
    { // 所有社群分类
      path: '/communityClass',
      name: 'communityClassMore',
      component: (resolve) => require(['@/pages/community/communityClass'], resolve)
    },
    { // 搜索社群
      path: '/searchCommunity',
      name: 'searchCommunity',
      component: (resolve) => require(['@/pages/community/searchCommunity'], resolve)
    },
    { // 群主所有群
      path: '/userCommunityClass/:id',
      name: 'userCommunityClass',
      component: (resolve) => require(['@/pages/community/userCommunity'], resolve)
    },
    { // 举报群动态
      path: '/CommunityCircleComplaint/:id',
      name: 'CommunityCircleComplaint',
      component: (resolve) => require(['@/pages/community/CircleComplaint'], resolve)
    },
    { // 群群动态详情
      path: '/communityCircleDetail/:id',
      name: 'communityCircleDetail',
      component: (resolve) => require(['@/pages/community/communityCircleDetail'], resolve)
    },
    { // 个人// 社群分类
      path: '/communityClass/:id',
      name: 'communityClass',
      component: (resolve) => require(['@/pages/community/class'], resolve)
    },
    { // 添加动态（社群）
      path: '/communityCircleEdit/:id',
      name: 'communityCircleEdit',
      component: (resolve) => require(['@/pages/community/communityCircleEdit'], resolve)
    },
    { // 社群详情
      path: '/communityDetail/:id',
      name: 'communityDetail',
      component: (resolve) => require(['@/pages/community/detail'], resolve)
    },
    { // 我的社群动态收藏
      path: '/communityCircleCollect',
      name: 'communityCircleCollect',
      component: (resolve) => require(['@/pages/user/communityCircleCollect'], resolve)
    },
    { // 红娘
      path: '/loveMate',
      name: 'loveMate',
      meta: {
        keepAlive: false // 需要被缓存
      },
      component: (resolve) => require(['@/pages/user/loveMate'], resolve)
    },
    { // 打赏
      path: '/givingMoney',
      name: 'givingMoney',
      meta: {
        keepAlive: false // 需要被缓存
      },
      component: (resolve) => require(['@/pages/user/givingMoney'], resolve)
    },
    { // 动态列表
      path: '/friendCircleList/:id',
      name: 'friendCircleList',
      meta: {
        keepAlive: false // 需要被缓存
      },
      component: (resolve) => require(['@/pages/friendCircle/friendCircleList'], resolve)
    },
    { // 动态详情
      path: '/friendCircleDetail/:id',
      name: 'friendCircleDetail',
      meta: {
        keepAlive: false // 需要被缓存
      },
      component: (resolve) => require(['@/pages/friendCircle/friendCircleDetail'], resolve)
    },
    { // 新建动态
      path: '/friendCircleEdit',
      name: 'friendCircleEdit',
      component: (resolve) => require(['@/pages/friendCircle/friendCircleEdit'], resolve)
    },
    { // 举报动态
      path: '/CircleComplaint/:id',
      name: 'CircleComplaint',
      component: (resolve) => require(['@/pages/friendCircle/CircleComplaint'], resolve)
    },
    { // 单身详情
      path: '/information/:id',
      name: 'information',
      component: (resolve) => require(['@/pages/user/information'], resolve)
    },
    { // 介绍人详情
      path: '/introducer/:id',
      name: 'introducer',
      component: (resolve) => require(['@/pages/user/introducer'], resolve)
    },
    { // 活动详情
      path: '/activityDetail/:id',
      name: 'activityDetail',
      component: (resolve) => require(['@/pages/activity/activityDetail'], resolve)
    },
    { // 活动报名成功
      path: '/activityPaySuccess/:id',
      name: 'activityPaySuccess',
      component: (resolve) => require(['@/pages/activity/activityPaySuccess'], resolve)
    },
    { // 完善资料
      path: '/PreviewData',
      name: 'PreviewData',
      component: (resolve) => require(['@/pages/user/PreviewData'], resolve)
    },
    { // 生活照
      path: '/uploadImage',
      name: 'uploadImage',
      component: (resolve) => require(['@/pages/user/uploadImage'], resolve)
    },
    { // 好友列表
      path: '/myFriend',
      name: 'myFriend',
      component: (resolve) => require(['@/pages/user/myFriend'], resolve)
    },
    {  // 升级VIP
      path: '/upgrade',
      name: 'upgrade',
      component: (resolve) => require(['@/pages/user/upgrade'], resolve)
    },
    { // 聊天列表
      path: '/chatList/:type',
      name: 'chatList',
      component: (resolve) => require(['@/pages/user/chatList'], resolve)
    },
    { // 意见反馈
      path: '/feedback',
      name: 'feedback',
      component: (resolve) => require(['@/pages/user/feedback'], resolve)
    },
    { // 聊天
      path: '/chitchat/:id',
      name: 'chitchatDetail',
      component: (resolve) => require(['@/pages/user/chitchat'], resolve)
    },
    { // 系统消息
      path: '/news',
      name: 'news',
      component: (resolve) => require(['@/pages/user/news'], resolve)
    },
    { // 上传身份证
      path: '/uploadIdCard',
      name: 'uploadIdCard',
      component: (resolve) => require(['@/pages/user/uploadIdCard'], resolve)
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
    },
    { // 福恋协议说明
      path: '/protocol',
      name: 'protocol',
      component: (resolve) => require(['@/pages/user/protocol'], resolve)
    },
    { // 云盾身份认证服务合同
      path: '/protocol2',
      name: 'protocol2',
      component: (resolve) => require(['@/pages/user/protocol2'], resolve)
    },
    { // 分享页面
      path: '/sharePage',
      name: 'sharePage',
      component: (resolve) => require(['@/pages/user/sharePage'], resolve)
    },
    { // 分享列表
      path: '/shareList',
      name: 'sharelist',
      component: (resolve) => require(['@/pages/user/shareList'], resolve)
    }

  ]
})
