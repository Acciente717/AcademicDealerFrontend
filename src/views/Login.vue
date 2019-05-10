<template>
  <div class="login">
    <h1>登录到Academic Dealer</h1>
    <el-form ref="form" :model="form" :rules="rules" label-width="80px" status-icon>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="form.email"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="form.password" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

import bcrypt from 'bcryptjs'

export default {
  data: () => ({
    form: {
      email: '',
      password: ''
    },
    rules: {
      email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
      password: [{ required: true, message: '请输入密码', trigger: 'change' }]
    }
  }),
  methods: {
    onSubmit () {
      let saltRounds = 10
      let hash = bcrypt.hashSync(this.form.password, saltRounds)
      let request = {
        dir: 'request',
        signature: {
          is_user: true, // is true when registering
          user_email: this.form.email,
          password_hash: hash
        },
        type: 'account',
        content: {
          action: 'login',
          data: {}
        }
      }

      console.log(request)

      // TODO: send request using axios and process response
    }
  }
}
</script>

<style scoped>
</style>
