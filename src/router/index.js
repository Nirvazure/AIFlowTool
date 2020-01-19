import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'API_Tester',
    component: () => import('../views/API_Tester.vue')
  },
  {
    path:'/chat',
    name:'Chat',
    component:()=>import('@/views/Chat')
  },
  {
    path:'/chat2',
    name:'Chat2',
    component:()=>import('@/views/Chat2')
  }
]

const router = new VueRouter({
  // mode: 'history',
  // base: process.env.BASE_URL,
  base:'/',
  routes
})

export default router
