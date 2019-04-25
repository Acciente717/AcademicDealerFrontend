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
    { path: '/lab', name: 'lab', component: () => import('./views/Lab.vue') }, {
      path: '/seminar',
      name: 'seminar',
      component: () => import('./views/Seminar.vue')
    },
    {
      path: '/project',
      name: 'project',
      component: () => import('./views/Project.vue')
    },
    {
      path: '/account/:accountId',
      name: 'account',
      component: () => import('./views/Account.vue')
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
      path: '/labinfo/:labId',
      name: 'labinfo',
      component: () => import('./views/SingleLabPage.vue')
    },
    {
      path: '/labinfoedit/:labId',
      name: 'labinfoedit',
      component: () => import('./views/SingleLabEditPage.vue')
    }
  ]
})
