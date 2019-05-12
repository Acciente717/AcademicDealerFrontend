import Vue from 'vue'
import Vuex from 'vuex'
import sha256 from 'js-sha256'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    serverUrl: 'http://127.0.0.1:8000',
    loggedIn: false,
    userEmail: '',
    emailHash: '',
    passwordHash: ''
  },
  mutations: {
    login (state, payload) {
      state.loggedIn = true
      state.userEmail = payload.userEmail
      state.emailHash = sha256.sha256(payload.userEmail)
      state.passwordHash = payload.passwordHash
    },
    logout (state) {
      state.loggedIn = false
      state.userEmail = ''
      state.emailHash = ''
      state.passwordHash = ''
    }
  },
  actions: {

  }
})
