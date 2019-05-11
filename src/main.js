import './registerServiceWorker'
import 'element-ui/lib/theme-chalk/index.css'
import 'v-markdown-editor/dist/index.css'

import ElementUI from 'element-ui'
import Vue from 'vue'
import VueResource from 'vue-resource'
import VueShowdown from 'vue-showdown'

import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false

Vue.use(ElementUI)
Vue.use(VueResource)
// the second parameter of Vue.use() is optional
Vue.use(VueShowdown, {
  // set default flavor of showdown
  flavor: 'github',
  // set default options of showdown (will override the flavor options)
  options: { emoji: false }
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
