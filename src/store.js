import Vue from 'vue'
import Vuex from 'vuex'
import bcrypt from 'bcryptjs'

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
      state.emailHash = bcrypt.hashSync(payload.userEmail, 10)
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
