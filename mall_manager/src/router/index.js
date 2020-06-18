import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login'
import Home from '../components/home'
import Welcome from '../components/Welcome'
import Users from '../components/users/Users'
import Admin from '../components/users/Admin'
import Goods from '../components/good/goods'
import Categories from '../components/good/categories'
import Orders from '../components/order/orders'
import Hotgoods from '../components/homepage/hotgoods'
import Newgoods from '../components/homepage/newgoods'
import Recommend from '../components/homepage/recommend'
import Carousel from '../components/homepage/carousel'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home',
    component: Home,
    redirect:'/welcome',
    children:[
      {path: '/welcome' , component: Welcome},
      {path: '/users' , component: Users},
      {path:'/admin', component: Admin},
      {path:'/goods',component: Goods},
      {path:'/categories',component:Categories},
      {path:'/orders',component:Orders},
      {path:'/hotgoods',component:Hotgoods},
      {path:'/newgoods',component:Newgoods},
      {path:'/recommend',component:Recommend},
      {path:'/carousel',component:Carousel}
    ]
  }

]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router
