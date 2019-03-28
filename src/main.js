import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import VueResource from 'vue-resource'

Vue.config.productionTip = false

Vue.use(ElementUI)
Vue.use(VueResource)

new Vue({
  router,
  store,
  render: h => h(App),
  http: {
    root: '/root',
    headers: {
      Authorization: 'Basic YXBpOnBhc3N3b3Jk'
    }
  }
}).$mount('#app')
