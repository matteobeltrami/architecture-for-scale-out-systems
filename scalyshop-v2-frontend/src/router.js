import { createRouter, createWebHistory } from 'vue-router'

import Home from './views/Home.vue'
import Customer from './views/Customer.vue'
import Basket from './views/Basket.vue'
import Admin from './views/Admin.vue'
import History from './views/History.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/customer',
    name: 'customer',
    component: Customer
  },
  {
    path: '/customer/finalize',
    name: 'basket',
    component: Basket
  },
  {
    path: '/customer/orders',
    name: 'history',
    component: History
  },
  {
    path: '/admin',
    name: 'admin',
    component: Admin
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router

