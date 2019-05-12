<template>
  <div class="login">
    <el-card class="login-card">
      <h1 style="text-align:center;">登录到Academic Dealer</h1>
      <el-form ref="form" :model="form" label-width="80px" status-icon>
        <el-form-item label="邮箱">
          <el-input v-model="form.email"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input type="password" v-model="form.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">登录</el-button>
          <el-button @click="goToRegisterPage">注册新账户</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<style scoped>
.login-card {
  max-width: 500px;
  margin: auto;
}
</style>

<script>
import sha256 from 'js-sha256'
import axios from 'axios'

export default {
  data: () => ({
    form: {
      email: '',
      password: ''
    },
    passwordHash: ''
  }),
  mounted: function () {
    this.checkLoginState()
  },
  watch: {
    $route (to, from) {
      // react to route changes...
      this.checkLoginState()
    }
  },
  methods: {
    checkLoginState () {
      if (this.$store.state.loggedIn) {
        this.$confirm('您已经是登录状态，是否退出当前账户？', '提示', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'info'
        })
          .then(() => {
            this.$store.commit('logout')
          })
          .catch(() => {
            this.$router.go(-1)
          })
      }
    },
    onSubmit () {
      this.passwordHash = sha256.sha256(this.form.password)

      let request = {
        dir: 'request',
        signature: {
          is_user: true, // is true when registering
          user_email: this.form.email,
          password_hash: this.passwordHash
        },
        content_type: 'account',
        content: {
          action: 'login',
          data: {}
        }
      }

      console.log(request)

      // Post request to server and parse response
      axios
        .post(this.$store.state.serverUrl + '/users/login/', request, {
          headers: {
            'Content-Type': 'text/plain'
          }
        })
        .then(response => {
          this.handleResponse(response)
        })
    },
    handleResponse (response) {
      const SUCCESS = 0
      const WRONG_PASSWORD = 1
      const ACCOUNT_NOT_FOUND = 2
      let statusCode = response.data.content.data.status
      switch (statusCode) {
        case SUCCESS:
          this.$message('登录成功！')
          this.$store.commit('login', {
            userEmail: this.form.email,
            passwordHash: this.passwordHash
          })
          this.$router.push('timeline/')
          break
        case WRONG_PASSWORD:
          this.$message.warning('密码错误！')
          break
        case ACCOUNT_NOT_FOUND:
          this.$message.warning('邮箱未被注册！')
          break
        default:
          this.$message.error(
            '应用内部错误：错误码：' + statusCode + '，请联系开发人员'
          )
      }
    },
    goToRegisterPage () {
      this.$router.push('/register')
    }
  }
}
</script>
