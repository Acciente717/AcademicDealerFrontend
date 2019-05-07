import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    serverUrl: '127.0.0.1:8000',
    loggedIn: false,
    userEmail: '',
    passwordHash: ''
  },
  mutations: {
    login (state, payload) {
      state.loggedIn = payload.loggedIn
      state.userEmail = payload.userEmail
      state.passwordHash = payload.passwordHash
    },
    logout (state) {
      state.loggedIn = false
      state.userEmail = ''
      state.passwordHash = ''
    }
  },
  actions: {

  }
})
