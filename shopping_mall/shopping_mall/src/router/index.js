import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Cart from '../views/Cart.vue'
import Category from '../views/Category.vue'
import ProductList from '../views/ProductList.vue'
import ProductDetail from '../views/ProductDetail.vue'
import User from '../views/User.vue'
import Order from '../views/Order.vue'
import OrderDetail from '../views/OrderDetail.vue'
import Setting from '../views/Setting.vue'
import Address from '../views/Address.vue'
import AddressEdit from '../views/AddressEdit.vue'
import Login from '../views/Login.vue'
import About from '../views/About.vue'
import CreateOrder from '../views/CreateOrder.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    redirect: '/home'
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: {
      index: 2
    }
  },
  {
    path: '/home',
    name: 'home',
    component: Home,
    meta: {
      index: 1
    }
  },
  {
    path: '/cart',
    name: 'cart',
    meta: {
      index: 1
    },
    component: Cart
  },
  {
    path: '/category',
    name: 'category',
    meta: {
      index: 1
    },
    component: Category
  },
  {
    path: '/product-list',
    name: 'product-list',
    meta: {
      index: 2
    },
    component: ProductList
  },
  {
    path: '/product/:id',
    name: 'product',
    meta: {
      index: 3
    },
    component: ProductDetail
  },
  {
    path: '/user',
    name: 'user',
    meta: {
      index: 1
    },
    component: User
  },
  {
    path: '/order',
    name: 'order',
    meta: {
      index: 2
    },
    component: Order
  },
  {
    path: '/order-detail',
    name: 'order-detail',
    meta: {
      index: 3
    },
    component: OrderDetail
  },
  {
    path: '/setting',
    name: 'setting',
    meta: {
      index: 2
    },
    component: Setting
  },
  {
    path: '/address',
    name: 'address',
    meta: {
      index: 2
    },
    component: Address
  },
  {
    path: '/address-edit',
    name: 'address-edit',
    meta: {
      index: 3
    },
    component: AddressEdit
  },
  {
    path: '/about',
    name: 'about',
    meta: {
      index: 2
    },
    component: About
  },
  {
    path: '/create-order',
    name: 'create-order',
    meta: {
      index: 2
    },
    component: CreateOrder
  },
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

export default router
