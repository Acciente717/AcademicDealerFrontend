<template>
  <div class="home">
    <h1 style="margin-bottom:0px;">Academic Dealer</h1>
    <p>一款为北大学生量身打造的高端学术社交平台</p>
    <el-row style="margin-top: 20px;">
      <el-col :span="8">
        <el-card class="info-card" shadow="hover">
          <el-image src="@assets/img/curie.png"></el-image>
        </el-card>
      </el-col>
      <el-col :span="8"><el-card class="info-card" shadow="hover"></el-card></el-col>
      <el-col :span="8"><el-card class="info-card" shadow="hover"></el-card></el-col>
    </el-row>
    <el-button type="primary" @click="goToRegisterPage">立即注册</el-button>
    <el-button @click="goToLoginPage">登录</el-button>
    <el-button @click="goToTimelinePage">随便看看</el-button>
  </div>
</template>

<style scoped>
.home {
  text-align: center;
}
.info-card {
  margin-left: 10px;
  margin-bottom: 10px;
}
</style>

<script>

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
