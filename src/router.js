import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

Vue.use(Router)

export default new Router({
  routes: [
    { path: '/', name: 'home', component: Home }, {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
          import(/* webpackChunkName: "about" */ './views/About.vue')
    },
    {
      path: '/timeline',
      name: 'timeline',
      component: () => import('./views/Timeline.vue')
    },
    {
      path: '/search',
      name: 'search',
      component: () => import('./views/Search.vue')
    },
    {
      path: '/post',
      name: 'post',
      component: () => import('./views/Post.vue')
    },
    {
      path: '/user/:email',
      name: 'user',
      component: () => import('./views/User.vue')
    },
    {
      path: '/feedback',
      name: 'feedback',
      component: () => import('./views/Feedback.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('./views/Login.vue')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('./views/Register.vue')
    },
    {
      path: '/lab/:labId',
      name: 'lab',
      component: () => import('./views/Lab.vue')
    },
    {
      path: '/labedit/:labId',
      name: 'labedit',
      component: () => import('./views/LabEdit.vue')
    }
  ]
})
