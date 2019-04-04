<template>
  <div class="register">
    <h1>注册</h1>
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="用户名">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="form.password"></el-input>
      </el-form-item>
      <el-form-item label="确认密码">
        <el-input v-model="form.confirmPassword"></el-input>
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input v-model="form.mail"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">注册</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data: () => ({
    form: {
      name: '',
      password: '',
      confirmPassword: '',
      mail: ''
    }
  }),
  methods: {
    onSubmit () {}
  }
}
</script>

<style>
</style>
