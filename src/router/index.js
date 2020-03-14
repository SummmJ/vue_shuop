/* eslint-disable */
import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/login.vue'
import Home from '../components/home.vue'
import '../assets/css/global.css'
import axios from 'axios'
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
axios.interceptors.request.use(config => {
  // 为请求头对象，添加 Token 验证的 Authorization 字段
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
Vue.prototype.$http = axios

Vue.use(VueRouter)

const router =  new VueRouter({
  routes: [
    { path: '/', redirect: '/login' }, // 重定向登录页面
    { path: '/login', component: Login },
    { path: '/home', component: Home}
  ]
})

//路由导航守卫函数 (如果用户没有登录直接输入url地址访问主页则重新导航到登录页面)
//to是将要访问的路径 from代表从哪个路径跳转而来 next是一个放行函数
router.beforeEach((to,from,next) => {
   if(to.path == '/login') return next()
   const token = window.sessionStorage.getItem('token')
   if(!token) return next('/login')
   next()
})


export default router