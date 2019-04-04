<template>
  <div class="home">
    <h1>Welcome to Academic Dealer</h1>
    <el-button type="primary" @click="goToRegisterPage">立即注册</el-button>
    <el-button @click="goToLoginPage">登录</el-button>
    <el-button @click="goToTimelinePage">随便看看</el-button>
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'home',
  components: {},
  methods: {
    goToLoginPage () {
      this.$router.push('/login')
    },
    goToRegisterPage () {
      this.$router.push('/register')
    },
    goToTimelinePage () {
      this.$router.push('/timeline')
    }
  }
}
</script>

<style scoped>
.home {
  text-align: center;
}
</style>
